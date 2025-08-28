import React, { useEffect, useState } from 'react';
import { supabase, Document } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Trash2, Eye, Calendar, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface DocumentHistoryProps {
  onDocumentSelect: (document: Document) => void;
  refreshTrigger?: number;
}

export function DocumentHistory({ onDocumentSelect, refreshTrigger }: DocumentHistoryProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [refreshTrigger]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDocuments(docs => docs.filter(doc => doc.id !== id));
    } catch (error: any) {
      setError(error.message);
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    return fileType === 'pdf' ? 
      <FileText className="w-4 h-4" /> : 
      <FileText className="w-4 h-4" />;
  };

  const getSummaryLengthColor = (length: string) => {
    const colors = {
      short: 'bg-green-100 text-green-700 border-green-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      long: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    return colors[length as keyof typeof colors] || colors.medium;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-100 rounded-md"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Document History</span>
          <Badge variant="secondary">{documents.length}</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No documents yet</p>
              <p className="text-sm">Upload your first document to get started</p>
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => onDocumentSelect(doc)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      {getFileTypeIcon(doc.file_type)}
                      <h4 className="font-medium text-gray-900 truncate">
                        {doc.filename}
                      </h4>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getSummaryLengthColor(doc.summary_length))}
                      >
                        {doc.summary_length} summary
                      </Badge>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDistanceToNow(new Date(doc.created_at))} ago</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {doc.summary.length > 100 
                        ? `${doc.summary.substring(0, 100)}...` 
                        : doc.summary}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDocumentSelect(doc);
                      }}
                      className="h-8 w-8"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDelete(doc.id, e)}
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}