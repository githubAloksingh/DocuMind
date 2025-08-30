import React from "react";
import { FileText, FileIcon, Brain } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface DocumentViewerProps {
  document: {
    filename: string;
    content: string;
    summary: string;
    file_type: "pdf" | "image";
    summary_length: "short" | "medium" | "long";
  };
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  const getSummaryLengthBadge = (length: string) => {
    const variants = {
      short: "bg-green-100 text-green-700 border-green-200",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      long: "bg-blue-100 text-blue-700 border-blue-200",
    };

    return (
      <Badge
        variant="outline"
        className={`border ${variants[length as keyof typeof variants]}`}
      >
        {length.charAt(0).toUpperCase() + length.slice(1)} Summary
      </Badge>
    );
  };

  return (
    <div className="w-full mt-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-gradient-to-r from-orange-100 to-yellow-50 p-4 rounded-lg border border-orange-200 shadow">
        <div className="flex items-center space-x-2">
          <FileIcon className="w-5 h-5 text-orange-600" />
          <span className="font-semibold truncate">{document.filename}</span>
        </div>
        {getSummaryLengthBadge(document.summary_length)}
      </div>

      {/* Tabs */}
      <div className="mt-4">
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-lg overflow-hidden">
            <TabsTrigger value="summary" className="flex items-center space-x-1">
              <Brain className="w-4 h-4" />
              <span>Summary</span>
            </TabsTrigger>

            <TabsTrigger value="original" className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>Original</span>
            </TabsTrigger>
          </TabsList>

          {/* Summary */}
        <TabsContent value="summary" className="mt-6">
  <button
    className="w-full text-left 
      bg-gray-200 
      text-gray-900 px-6 py-4 rounded-xl 
      border border-gray-300
      shadow-sm hover:shadow-md 
      hover:bg-gray-300 
      transition-all duration-300"
  >
    <p className="leading-relaxed text-sm sm:text-base font-normal">
      {document.summary}
    </p>
  </button>
</TabsContent>


          {/* Original */}
          <TabsContent value="original" className="mt-6">
            <button
              className="w-full text-left bg-gradient-to-r from-gray-700 to-gray-500
              text-white px-6 py-4 rounded-xl shadow-lg hover:scale-[1.01] transition-all"
            >
              <pre className="max-h-[500px] overflow-y-auto font-mono text-sm whitespace-pre-wrap leading-relaxed">
                {document.content}
              </pre>
            </button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
