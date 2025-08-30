import React from "react";
import { Settings, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryOptionsProps {
  summaryLength: "short" | "medium" | "long";
  onSummaryLengthChange: (length: "short" | "medium" | "long") => void;
  onGenerate: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

export function SummaryOptions({
  summaryLength,
  onSummaryLengthChange,
  onGenerate,
  isGenerating,
  disabled,
}: SummaryOptionsProps) {
  return (
    <Card className="w-full border border-orange-200 shadow-md">
      {/* Header with subtle gradient */}
      <CardHeader className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-t-lg">
        <CardTitle className="flex items-center space-x-2 text-orange-800">
          <Settings className="w-5 h-5 text-orange-600" />
          <span className="font-semibold">Summarizer Settings</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 pt-4">
        {/* Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800">
            Summary Length
          </label>
          <Select
            value={summaryLength}
            onValueChange={onSummaryLengthChange}
            disabled={disabled}
          >
            <SelectTrigger className="w-full border-gray-300 focus:ring-2 focus:ring-orange-400 rounded-md">
              <SelectValue placeholder="Choose length..." />
            </SelectTrigger>
            <SelectContent className="rounded-md shadow-lg">
              <SelectItem value="short">✨ Short (2-3 sentences)</SelectItem>
              <SelectItem value="medium">📄 Medium (1-2 paragraphs)</SelectItem>
              <SelectItem value="long">📚 Long (3-4 paragraphs)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Button */}
        <Button
          onClick={onGenerate}
          disabled={disabled || isGenerating}
          className="w-full py-5 text-white font-semibold rounded-md shadow-md 
                     bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all"
          size="lg"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Generating Summary...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate AI Summary
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
