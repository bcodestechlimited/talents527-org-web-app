import { useState } from "react";
import {
  FileIcon,
  FileText,
  FileImage,
  Eye,
  Download,
  CheckCircle,
} from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import type { Document } from "@/types/documents";

interface ExistingDocumentCardProps {
  document: Document;
}

export function ExistingDocumentCard({ document }: ExistingDocumentCardProps) {
  const Icon = getFileIcon(document.mimeType);
  const isImage = document.mimeType?.startsWith("image/");
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex items-center space-x-3 p-3 border border-green-200 rounded-lg bg-green-50">
      {isImage && !imageError ? (
        <div className="flex-shrink-0">
          <img
            src={document.url}
            alt={document.originalName}
            className="h-12 w-12 rounded object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <Icon className="h-5 w-5 text-blue-600 flex-shrink-0" />
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {document.originalName}
        </p>
        <p className="text-xs text-gray-500">
          {formatFileSize(document.bytes)} • {document.mimeType}
        </p>
        <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
          <CheckCircle className="h-3 w-3" />
          Already uploaded
        </p>
      </div>

      <div className="flex gap-2">
        <a
          href={document.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-600/80 p-1 hover:bg-indigo-50 rounded"
          title="View File"
        >
          <Eye className="h-4 w-4" />
        </a>
        <a
          href={document.url}
          download={document.originalName}
          className="text-indigo-600 hover:text-indigo-600/80 p-1 hover:bg-indigo-50 rounded"
          title="Download File"
        >
          <Download className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

const getFileIcon = (mimeType: string) => {
  if (mimeType?.startsWith("image/")) return FileImage;
  if (mimeType === "application/pdf") return FileText;
  if (mimeType?.startsWith("text/")) return FileText;
  return FileIcon;
};
