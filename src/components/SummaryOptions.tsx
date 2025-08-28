import React from 'react';
import { Settings, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryOptionsProps {
  summaryLength: 'short' | 'medium' | 'long';
  onSummaryLengthChange: (length: 'short' | 'medium' | 'long') => void;
  onGenerate: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

export function SummaryOptions({ 
  summaryLength, 
  onSummaryLengthChange, 
  onGenerate, 
  isGenerating, 
  disabled 
}: SummaryOptionsProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Summary Options</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Summary Length
          </label>
          <Select
            value={summaryLength}
            onValueChange={onSummaryLengthChange}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short (2-3 sentences)</SelectItem>
              <SelectItem value="medium">Medium (1-2 paragraphs)</SelectItem>
              <SelectItem value="long">Long (3-4 paragraphs)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={onGenerate}
          disabled={disabled || isGenerating}
          className="w-full"
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