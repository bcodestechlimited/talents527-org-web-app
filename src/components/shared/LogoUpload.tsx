import { useState, useRef, type ChangeEvent } from "react";
import { Camera, X, Check, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/errorHandler";
import { uploadLogo } from "@/services/upload.service";
import type { User } from "@/types/user";

interface LogoUploadProps {
  user: User;
  onUploadSuccess: () => void;
}

export default function LogoUpload({ user, onUploadSuccess }: LogoUploadProps) {
  const [previewImage, setPreviewImage] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);



  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("logo", file);

      return uploadLogo(formData);
    },
    onSuccess: () => {
      // console.log("Upload successful:", data);
      setIsUploading(false);
      setPreviewImage("");
      setProgress(0);
      setError(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      onUploadSuccess();
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
    setError(null);
    setProgress(0);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!previewImage) return;

    const response = await fetch(previewImage);
    const blob = await response.blob();
    const file = new File([blob], "company-logo.jpg", { type: blob.type });

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
      await uploadMutation.mutateAsync(file);
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
      <label className="flex items-center gap-0 text-slate-950">
        <span>Company Logo</span>
        <span className="text-base text-rose-400">&#42;</span>
      </label>

      <Input
        type="file"
        ref={inputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {user.logoId && !isUploading ? (
        <div className="flex space-x-2 items-center">
          <div className="relative w-32 h-32">
            <img
              src={user.logoId.url}
              alt="Company logo"
              className="w-full h-full object-cover rounded-lg border-2"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white p-0"
              onClick={triggerFileInput}
              title="Change logo"
            >
              <Camera className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex-1 ml-4">
            <p className="text-sm text-indigo-600 font-medium flex items-center gap-1">
              <Check className="h-4 w-4" />
              Logo uploaded successfully
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {user.logoId.originalName}
            </p>
            <Button
              type="button"
              variant="outline"
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
            <div className="relative w-32 h-32">
              <img
                src={previewImage}
                alt="Logo preview"
                className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
              />
              {uploadMutation.isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                  <CircularProgress value={progress} />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <Button
                type="button"
                variant="outline"
                className="text-indigo1-600 hover:text-indigo1-700 border-indigo1-200"
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
                <X className="h-4 w-4 mr-1" />
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
              Click to select company logo
            </span>
            <span className="text-xs text-gray-400 mt-1">
              PNG, JPG up to 5MB
            </span>
          </div>

          {!user.logoId && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-700">
                <strong>Logo required:</strong> Please upload your company logo
                to continue to the next step.
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
