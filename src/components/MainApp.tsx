import React, { useState } from "react";
import { extractText } from "@/lib/textExtraction";
import { generateSummary, generateSuggestions } from "@/lib/gemini";
import { FileUpload } from "@/components/FileUpload";
import { SummaryOptions } from "@/components/SummaryOptions";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { DocumentViewer } from "@/components/DocumentViewer";

type ProcessingStage =
  | "idle"
  | "extracting"
  | "ready"
  | "summarizing"
  | "suggestions"
  | "complete"
  | "error";

export function MainApp() {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [summaryLength, setSummaryLength] = useState<
    "short" | "medium" | "long"
  >("medium");
  const [processingStage, setProcessingStage] =
    useState<ProcessingStage>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string | null>(null);

  const resetState = () => {
    setCurrentFile(null);
    setExtractedText("");
    setProcessingStage("idle");
    setProgress(0);
    setError("");
    setSummary(null);
    setSuggestions(null);
  };

  const handleFileSelect = async (file: File) => {
    resetState();
    setCurrentFile(file);

    try {
      setProcessingStage("extracting");
      setProgress(0);

      const text = await extractText(file, (p) => setProgress(Math.round(p)));

      if (!text.trim()) {
        throw new Error(
          "No text could be extracted. Try a clearer scan or higher-quality image."
        );
      }

      setExtractedText(text);
      setProcessingStage("ready");
      setProgress(100);
    } catch (err: any) {
      setError(err.message || "Failed to extract text from file.");
      setProcessingStage("error");
    }
  };

  const handleGenerateSummary = async () => {
    if (!extractedText || !currentFile) return;

    try {
      setProcessingStage("summarizing");
      setProgress(20);

      const summaryText = await generateSummary(extractedText, summaryLength);
      setSummary(summaryText);
      setProgress(70);

      setProcessingStage("suggestions");
      const suggestionsText = await generateSuggestions(
        summaryText,
        extractedText
      );
      setSuggestions(suggestionsText);
      setProgress(100);

      setProcessingStage("complete");
    } catch (err: any) {
      setError(err.message || "Something went wrong during summarization.");
      setProcessingStage("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-end p-4">
  {(currentFile || summary || extractedText) && (
    <button
      onClick={resetState}
      className="flex items-center gap-2 px-5 py-2.5 
                 bg-gradient-to-r from-orange-500 to-amber-600 
                 text-white font-medium rounded-full shadow-lg 
                 hover:from-orange-600 hover:to-amber-700 
                 active:scale-95 transform transition-all duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4v16m8-8H4"
        />
      </svg>
      New Document
    </button>
  )}
</div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side: Upload + Options */}
          <div className="space-y-6">
            <FileUpload
              onFileSelect={handleFileSelect}
              isProcessing={
                processingStage !== "idle" && processingStage !== "complete"
              }
              error={error}
            />

            {extractedText && (
  <SummaryOptions
    summaryLength={summaryLength}
    onSummaryLengthChange={setSummaryLength}
    onGenerate={handleGenerateSummary}
    isGenerating={
      processingStage === "summarizing" ||
      processingStage === "suggestions"
    }
    disabled={!extractedText}
  />
)}

          </div>

          {/* Right side: Status + Results */}
          <div>
            {currentFile && processingStage !== "idle" && (
              <ProcessingStatus
                stage={processingStage}
                progress={progress}
                filename={currentFile.name}
                error={error}
              />
            )}

            {(summary || suggestions) && processingStage === "complete" && (
              <DocumentViewer
                document={{
                  filename: currentFile?.name || "Uploaded Document",
                  content: extractedText,
                  summary: summary || "",
                  suggestions: suggestions || "",
                  file_type:
                    currentFile?.type === "application/pdf" ? "pdf" : "image",
                  summary_length: summaryLength,
                }}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
