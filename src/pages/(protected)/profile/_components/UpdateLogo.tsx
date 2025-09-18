import { useState, useRef, type ChangeEvent } from "react";
import { X, Check, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/errorHandler";
import { updateOrganisationLogo } from "@/services/upload.service";
import type { Organisation } from "@/types/organisation";
import { toast } from "sonner";

interface UpdateLogoProps {
  organisation: Organisation;
}

export default function UpdateLogo({ organisation }: UpdateLogoProps) {
  const queryClient = useQueryClient();

  const [previewImage, setPreviewImage] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("logo", file);

      return updateOrganisationLogo(formData);
    },
    onSuccess: (data) => {
      setIsUploading(false);
      setPreviewImage("");
      setSelectedFile(null);
      setProgress(0);
      setError(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["organisation-info"],
      });
    },
    onError: (error: unknown) => {
      console.error("Upload failed:", error);
      const errorMessage = getErrorMessage(error, "Failed to upload logo");
      setError(errorMessage);
      setProgress(0);
      setIsUploading(false);
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      // Store the original file
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
        setIsUploading(true);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setIsUploading(false);
    setPreviewImage("");
    setSelectedFile(null);
    setError(null);
    setProgress(0);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await uploadMutation.mutateAsync(selectedFile); // Upload the original file
      setProgress(100);
      setTimeout(() => clearInterval(progressInterval), 100);
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      console.log(error);
    }
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Input
        type="file"
        ref={inputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {organisation.logoId && !isUploading ? (
        <div className="flex space-x-2 items-center">
          <div className="relative w-20 h-20">
            <img
              src={organisation.logoId?.url}
              alt="Organisation logo"
              className="w-full h-full object-cover rounded-full border"
            />
          </div>
          <div className="flex-1 ml-4">
            <p className="text-xs text-gray-500 mt-1">
              {organisation?.logoId?.originalName}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2 text-xs"
              onClick={triggerFileInput}
            >
              Change Logo
            </Button>
          </div>
        </div>
      ) : isUploading ? (
        <div className="space-y-3">
          <div className="flex space-x-3 items-center">
            <div className="relative w-20 h-20">
              <img
                src={previewImage}
                alt="Logo preview"
                className="w-full h-full object-cover rounded-full border border-gray-200"
              />
              {uploadMutation.isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <CircularProgress value={progress} />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {selectedFile && (
                <p className="text-xs text-gray-500">{selectedFile.name}</p>
              )}
              <Button
                type="button"
                variant="ghost"
                className="text-indigo-600 text-sm hover:text-indigo-700"
                onClick={handleSave}
                disabled={uploadMutation.isPending}
              >
                <Check className="h-4 w-4" />
                {uploadMutation.isPending ? "Uploading..." : "Upload Logo"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="text-red-500 hover:text-red-600"
                onClick={handleCancel}
                disabled={uploadMutation.isPending}
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
          {error && (
            <p className="text-xs text-rose-500 bg-rose-50 p-2 rounded">
              {error}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div
            onClick={triggerFileInput}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
          >
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">
              Click to select organisation logo
            </span>
            <span className="text-xs text-gray-400 mt-1">
              PNG, JPG up to 5MB
            </span>
          </div>

          {!organisation.logoId && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-700">
                <strong>Logo required:</strong> Please upload your organisation
                logo to continue to the next step.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CircularProgress({ value }: { value: number }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-12 h-12">
      <svg className="w-full h-full" viewBox="0 0 50 50">
        <circle
          className="text-gray-300"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="25"
          cy="25"
        />
        <circle
          className="text-indigo-600"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="25"
          cy="25"
          transform="rotate(-90 25 25)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
        {value}%
      </div>
    </div>
  );
}
