import axios from "axios";
import {
  FileIcon,
  FileText,
  FileImage,
  X,
  Upload,
  //   Trash2,
  Eye,
  Download,
  AlertCircle,
} from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { useController, type Control } from "react-hook-form";
import { type NewRequestSchemaData } from "@/schemas/requests.schema";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/utils";

type FileWithProgress = {
  id: string;
  file: File;
  progress: number;
  uploaded: boolean;
  url?: string;
  error?: string;
};

interface RequestDocumentUploadProps {
  control: Control<NewRequestSchemaData>;
  name: "documents";
}

export function RequestDocumentUpload({
  control,
  name,
}: RequestDocumentUploadProps) {
  const {
    field: { value: uploadedUrls = [], onChange },
  } = useController({
    control,
    name,
  });

  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      progress: 0,
      uploaded: false,
      id: `${file.name}-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (files.length === 0 || uploading) return;

    setUploading(true);
    const successfullyUploadedUrls: string[] = [];

    try {
      for (const fileWithProgress of files) {
        // Skip already uploaded files
        if (fileWithProgress.uploaded) {
          successfullyUploadedUrls.push(fileWithProgress.url!);
          continue;
        }

        const formData = new FormData();
        formData.append("file", fileWithProgress.file);

        try {
          const response = await axios.post(
            "https://httpbin.org/post",
            formData,
            {
              onUploadProgress: (progressEvent) => {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / (progressEvent.total || 1)
                );
                setFiles((prev) =>
                  prev.map((file) =>
                    file.id === fileWithProgress.id
                      ? { ...file, progress }
                      : file
                  )
                );
              },
            }
          );

          const fileUrl = response.data.url;
          successfullyUploadedUrls.push(fileUrl);

          setFiles((prev) =>
            prev.map((file) =>
              file.id === fileWithProgress.id
                ? { ...file, uploaded: true, url: fileUrl, progress: 100 }
                : file
            )
          );
        } catch (error) {
          console.error(
            "Upload failed for file:",
            fileWithProgress.file.name,
            error
          );

          setFiles((prev) =>
            prev.map((file) =>
              file.id === fileWithProgress.id
                ? {
                    ...file,
                    error: "Upload failed. Please try again.",
                    progress: 0,
                  }
                : file
            )
          );
        }
      }

      // Update form field with all successfully uploaded URLs
      onChange(successfullyUploadedUrls);
    } catch (error) {
      console.error("Upload process failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const updatedFiles = prev.filter((file) => file.id !== id);

      // Update form field to remove the URL if the file was uploaded
      const fileToRemove = prev.find((file) => file.id === id);
      if (fileToRemove && fileToRemove.uploaded && fileToRemove.url) {
        const updatedUrls = uploadedUrls.filter(
          (url) => url !== fileToRemove.url
        );
        onChange(updatedUrls);
      }

      return updatedFiles;
    });
  };

  const handleCancel = () => {
    // Only remove files that haven't been uploaded yet
    setFiles((prev) => {
      const filesToKeep = prev.filter((file) => file.uploaded);
      return filesToKeep;
    });
    setShowUploader(false);
  };

  const handleAddMoreFiles = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  if (!showUploader) {
    return (
      <Button
        type="button"
        onClick={() => setShowUploader(true)}
        className="flex items-center gap-2"
      >
        <Upload size={16} />
        Attach Documents
      </Button>
    );
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Upload Documents</h3>
        <button
          type="button"
          onClick={handleCancel}
          className="text-gray-500 hover:text-gray-700"
          disabled={uploading}
        >
          <X size={20} />
        </button>
      </div>

      <input
        type="file"
        ref={inputRef}
        onChange={handleFileSelect}
        multiple
        className="hidden"
        id="document-upload"
        disabled={uploading}
      />

      <div className="mb-4 flex gap-2">
        <label
          htmlFor="document-upload"
          className="flex cursor-pointer items-center gap-2 rounded-md bg-primary px-3 py-2 text-primary-foreground hover:bg-primary/90"
        >
          <Upload size={16} />
          Select Files
        </label>

        {files.length > 0 && (
          <Button
            type="button"
            onClick={handleAddMoreFiles}
            variant="outline"
            disabled={uploading}
          >
            Add More Files
          </Button>
        )}
      </div>

      <FileList files={files} onRemove={removeFile} uploading={uploading} />

      <div className="mt-4 flex gap-2">
        <Button
          type="button"
          onClick={handleUpload}
          disabled={
            files.length === 0 || uploading || files.every((f) => f.uploaded)
          }
          className="flex items-center gap-2"
        >
          <Upload size={16} />
          {uploading ? "Uploading..." : "Upload Documents"}
        </Button>

        <Button
          type="button"
          onClick={handleCancel}
          variant="outline"
          disabled={uploading}
        >
          Done
        </Button>
      </div>
    </div>
  );
}

function FileList({
  files,
  onRemove,
  uploading,
}: {
  files: FileWithProgress[];
  onRemove: (id: string) => void;
  uploading: boolean;
}) {
  if (files.length === 0) {
    return (
      <div className="text-gray-500 py-4 text-center">No files selected</div>
    );
  }

  return (
    <div className="space-y-3">
      {files.map((file) => (
        <FileItem
          key={file.id}
          file={file}
          onRemove={onRemove}
          uploading={uploading}
        />
      ))}
    </div>
  );
}

function FileItem({
  file,
  onRemove,
  uploading,
}: {
  file: FileWithProgress;
  onRemove: (id: string) => void;
  uploading: boolean;
}) {
  const Icon = getFileIcon(file.file.type);
  const isImage = file.file.type.startsWith("image/");
  const [imageError, setImageError] = useState(false);

  return (
    <div className="rounded-md border p-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {isImage && file.uploaded && file.url && !imageError ? (
            <div className="flex-shrink-0">
              <img
                src={file.url}
                alt={file.file.name}
                className="h-12 w-12 rounded object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <Icon size={48} className="text-blue-600 flex-shrink-0" />
          )}

          <div className="min-w-0 flex-1">
            <div className="font-medium truncate">{file.file.name}</div>
            <div className="text-sm text-muted-foreground">
              {formatFileSize(file.file.size)} •{" "}
              {file.file.type || "Unknown type"}
            </div>

            {file.error && (
              <Alert variant="destructive" className="mt-2 py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {file.error}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {!uploading && (
          <button
            type="button"
            onClick={() => onRemove(file.id)}
            className="text-destructive hover:text-destructive/80"
            disabled={uploading}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {!file.uploaded && (
        <div className="mt-3">
          <Progress value={file.progress} className="h-2" />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>
              {file.uploaded ? "Completed" : `${file.progress}%`}
              {uploading && !file.uploaded && " uploading..."}
            </span>
            {file.uploaded && <span>✓ Done</span>}
          </div>
        </div>
      )}

      {file.uploaded && file.url && (
        <div className="mt-2 flex justify-end gap-2">
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80"
            title="View File"
          >
            <Eye size={16} />
          </a>
          <a
            href={file.url}
            download
            className="text-primary hover:text-primary/80"
            title="Download File"
          >
            <Download size={16} />
          </a>
        </div>
      )}
    </div>
  );
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) return FileImage;
  if (mimeType === "application/pdf") return FileText;
  if (mimeType.startsWith("text/")) return FileText;
  return FileIcon;
};
