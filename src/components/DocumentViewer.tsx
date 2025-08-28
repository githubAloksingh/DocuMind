import React from 'react';
import { FileText, Lightbulb, Calendar, FileIcon, Brain } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Document } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';

interface DocumentViewerProps {
  document: Document;
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <p key={index} className="mb-2 leading-relaxed">
        {line.trim()}
      </p>
    ));
  };

  const getSummaryLengthBadge = (length: string) => {
    const variants = {
      short: 'bg-green-100 text-green-700 border-green-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      long: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    
    return (
      <Badge variant="outline" className={`border ${variants[length as keyof typeof variants]}`}>
        {length.charAt(0).toUpperCase() + length.slice(1)} Summary
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center space-x-2">
            <FileIcon className="w-5 h-5" />
            <span className="truncate">{document.filename}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {getSummaryLengthBadge(document.summary_length)}
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{formatDistanceToNow(new Date(document.created_at))} ago</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary" className="flex items-center space-x-1">
              <Brain className="w-4 h-4" />
              <span>Summary</span>
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center space-x-1">
              <Lightbulb className="w-4 h-4" />
              <span>Suggestions</span>
            </TabsTrigger>
            <TabsTrigger value="original" className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>Original</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="mt-6">
            <div className="prose max-w-none">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
                <div className="text-gray-800">
                  {formatText(document.summary)}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="suggestions" className="mt-6">
            <div className="space-y-4">
              {document.suggestions && document.suggestions.length > 0 ? (
                document.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg transition-all hover:shadow-sm">
                    <div className="flex-shrink-0 w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                      <Lightbulb className="w-3 h-3 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 leading-relaxed">{suggestion}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No suggestions available</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="original" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <div className="bg-gray-50 p-6 rounded-lg max-h-96 overflow-y-auto">
                  <div className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                    {document.content}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}