import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Image, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  error?: string;
}

export function FileUpload({ onFileSelect, isProcessing, error }: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        return;
      }
      if (acceptedFiles.length > 0 && !isProcessing) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect, isProcessing]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg", ".tiff", ".bmp", ".gif"],
    },
    multiple: false,
    disabled: isProcessing,
    maxSize: 10 * 1024 * 1024, // 10MB limit
  });

  const hasError = error || fileRejections.length > 0;
  const hasFile = acceptedFiles.length > 0;

  return (
    <Card className="w-full border-none shadow-xl rounded-2xl bg-white/60 backdrop-blur-md">
      <CardContent className="p-0">
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ease-in-out transform",
            isDragActive
              ? "border-orange-500 bg-orange-50 scale-[1.02] shadow-md"
              : hasError
              ? "border-red-400 bg-red-50"
              : "border-gray-300 hover:border-orange-400 hover:bg-orange-50 hover:scale-[1.01]",
            isProcessing && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center space-y-4">
            {/* Icon Bubble */}
            <div
              className={cn(
                "p-5 rounded-full shadow-md transition-colors duration-300",
                isDragActive
                  ? "bg-orange-100"
                  : hasError
                  ? "bg-red-100"
                  : hasFile
                  ? "bg-green-100"
                  : "bg-gray-100"
              )}
            >
              {hasError ? (
                <AlertCircle className="w-10 h-10 text-red-600" />
              ) : hasFile ? (
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              ) : (
                <Upload
                  className={cn(
                    "w-10 h-10 transition-colors duration-300",
                    isDragActive ? "text-orange-600" : "text-gray-600"
                  )}
                />
              )}
            </div>

            {/* Title / Message */}
            <div>
              <p className="text-xl font-bold text-gray-800 mb-2">
                {isDragActive
                  ? "Drop your document here ✨"
                  : hasError
                  ? "Upload failed"
                  : hasFile
                  ? "File uploaded successfully!"
                  : "Upload a document"}
              </p>

              {/* Subtext */}
              {hasError ? (
                <p className="text-sm text-red-600 mb-4">
                  {error ||
                    "File rejected. Please check file type and size (max 10MB)."}
                </p>
              ) : hasFile ? (
                <p className="text-sm text-green-600 mb-4">
                  Ready to generate your summary 🚀
                </p>
              ) : (
                <p className="text-sm text-gray-500 mb-4">
                  Drag & drop or click to select a PDF or image file (max 10MB)
                </p>
              )}

              {/* File Types */}
              <div className="flex justify-center space-x-8 text-sm font-medium">
                <div className="flex items-center space-x-1 text-gray-500">
                  <FileText className="w-5 h-5 text-orange-500" />
                  <span>PDF</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Image className="w-5 h-5 text-orange-500" />
                  <span>JPG, PNG, TIFF</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner (extra UI detail) */}
        <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white p-3 text-sm font-semibold rounded-b-2xl text-center">
          💡 Tip: High-quality PDFs/images will give the best summaries
        </div>
      </CardContent>
    </Card>
  );
}


