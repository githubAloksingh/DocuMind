import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  error?: string;
}

export function FileUpload({ onFileSelect, isProcessing, error }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      return;
    }
    
    if (acceptedFiles.length > 0 && !isProcessing) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect, isProcessing]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.gif']
    },
    multiple: false,
    disabled: isProcessing,
    maxSize: 10 * 1024 * 1024 // 10MB limit
  });

  const hasError = error || fileRejections.length > 0;

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300",
            isDragActive 
              ? "border-blue-500 bg-blue-50 scale-[1.02]" 
              : hasError
                ? "border-red-300 bg-red-50"
                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50",
            isProcessing && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              "p-4 rounded-full transition-colors duration-300",
              isDragActive 
                ? "bg-blue-100" 
                : hasError 
                  ? "bg-red-100" 
                  : "bg-gray-100"
            )}>
              {hasError ? (
                <AlertCircle className="w-8 h-8 text-red-600" />
              ) : (
                <Upload className={cn(
                  "w-8 h-8 transition-colors duration-300",
                  isDragActive ? "text-blue-600" : "text-gray-600"
                )} />
              )}
            </div>
            
            <div>
              <p className="text-lg font-semibold text-gray-700 mb-2">
                {isDragActive 
                  ? 'Drop your document here' 
                  : hasError
                    ? 'Upload failed'
                    : 'Upload a document'}
              </p>
              
              {hasError ? (
                <p className="text-sm text-red-600 mb-4">
                  {error || 'File rejected. Please check file type and size (max 10MB).'}
                </p>
              ) : (
                <p className="text-sm text-gray-500 mb-4">
                  Drag & drop or click to select a PDF or image file (max 10MB)
                </p>
              )}
              
              <div className="flex justify-center space-x-6 text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>PDF</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Image className="w-4 h-4" />
                  <span>JPG, PNG, TIFF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}