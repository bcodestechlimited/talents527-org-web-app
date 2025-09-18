import { useState, useRef, type ChangeEvent } from "react";
import { Check, Upload, FileText, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadRequestDocuments } from "@/services/upload.service";
import { getErrorMessage } from "@/lib/errorHandler";
import { ExistingDocumentCard } from "./ExistingDocumentCard";
import type { Organisation } from "@/types/organisation";

interface DocumentFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  isUploading: boolean;
}

interface MultiDocumentUploadProps {
  organisation?: Organisation;
  maxFiles?: number;
  maxFileSize?: number;
  isDisabled?: boolean;
}

export default function MultiDocumentUpload({
  organisation,
  maxFiles = 10,
  maxFileSize = 5,
  isDisabled = false,
}: MultiDocumentUploadProps) {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const existingDocuments = organisation?.requestDocsIds || [];

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return uploadRequestDocuments(formData);
    },
    onSuccess: () => {
      setDocuments((prev) =>
        prev.map((doc) => ({
          ...doc,
          progress: 100,
          isUploading: false,
        }))
      );

      setError(null);

      queryClient.invalidateQueries({
        queryKey: ["organisation-info"],
      });

      setTimeout(() => {
        setDocuments([]);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }, 1500);
    },
    onError: (error: unknown) => {
      console.error("Upload failed:", error);
      const errorMessage = getErrorMessage(error, "Failed to upload documents");
      setError(errorMessage);

      setDocuments((prev) =>
        prev.map((doc) => ({
          ...doc,
          progress: 0,
          isUploading: false,
        }))
      );
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (documents.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles: DocumentFile[] = [];
    let hasError = false;

    files.forEach((file) => {
      if (file.size > maxFileSize * 1024 * 1024) {
        setError(`File "${file.name}" is larger than ${maxFileSize}MB`);
        hasError = true;
        return;
      }

      // Accept common document types
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "image/jpeg",
        "image/png",
        "image/gif",
      ];

      if (!allowedTypes.includes(file.type)) {
        setError(`File "${file.name}" is not a supported format`);
        hasError = true;
        return;
      }

      const documentFile: DocumentFile = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview: file.name,
        progress: 0,
        isUploading: false,
      };

      validFiles.push(documentFile);
    });

    if (!hasError && validFiles.length > 0) {
      setDocuments((prev) => [...prev, ...validFiles]);
      setError(null);
    }
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    setError(null);
  };

  const handleUpload = async () => {
    if (documents.length === 0) return;

    const formData = new FormData();
    documents.forEach((doc) => {
      formData.append(`document_${doc.id}`, doc.file);
    });

    setDocuments((prev) =>
      prev.map((doc) => ({
        ...doc,
        isUploading: true,
        progress: 0,
      }))
    );

    const progressInterval = setInterval(() => {
      setDocuments((prev) =>
        prev.map((doc) => {
          if (doc.isUploading && doc.progress < 90) {
            return { ...doc, progress: doc.progress + 10 };
          }
          return doc;
        })
      );
    }, 200);

    try {
      await uploadMutation.mutateAsync(formData);

      setDocuments((prev) =>
        prev.map((doc) => ({
          ...doc,
          progress: 100,
        }))
      );

      clearInterval(progressInterval);
    } catch (error) {
      console.log(error);
      clearInterval(progressInterval);
    }
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  const isUploading = documents.some((doc) => doc.isUploading);
  const canUpload = documents.length > 0 && !isUploading;

  return (
    <div className="space-y-4">
      <label className="text-sm text-slate-500 mb-1">
        <span className="">Request Documents(optional)</span>
      </label>

      <Input
        type="file"
        ref={inputRef}
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
        multiple
        disabled={isDisabled}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="space-y-2">
        <div
          onClick={!isDisabled ? triggerFileInput : undefined}
          className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors
    ${
      isDisabled
        ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
        : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer"
    }`}
        >
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">
            Click to select documents ({documents.length}/{maxFiles})
          </span>
          <span className="text-xs text-gray-400 mt-1">
            PDF, DOC, DOCX, TXT, JPG, PNG up to {maxFileSize}MB each
          </span>
        </div>
      </div>

      {existingDocuments.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">
            Existing Documents ({existingDocuments.length})
          </h4>
          <div className="space-y-2">
            {existingDocuments.map((doc) => (
              <ExistingDocumentCard key={doc._id} document={doc} />
            ))}
          </div>
        </div>
      )}

      {documents.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">
              New Documents to Upload ({documents.length})
            </h4>
            {canUpload && (
              <Button
                type="button"
                variant="outline"
                className="text-indigo-600 hover:text-indigo-700 border-indigo-200"
                onClick={handleUpload}
              >
                <Check className="h-4 w-4 mr-1" />
                Upload All
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
              >
                <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {doc.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(doc.file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>

                  {doc.isUploading && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-indigo-600">Uploading...</span>
                        <span className="text-indigo-600">{doc.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${doc.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {doc.progress === 100 && !doc.isUploading && (
                    <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
                      <Check className="h-3 w-3" />
                      Uploaded successfully
                    </p>
                  )}
                </div>

                {!isUploading && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 h-8 w-8 p-0 flex-shrink-0"
                    onClick={() => removeDocument(doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}

      {isUploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700 flex items-center gap-2">
            Uploading documents...
          </p>
        </div>
      )}
    </div>
  );
}
