import React, { useState } from 'react';
import { supabase, Document } from '@/lib/supabase';
import { extractText } from '@/lib/textExtraction';
import { generateSummary, generateSuggestions } from '@/lib/gemini';
import { FileUpload } from '@/components/FileUpload';
import { SummaryOptions } from '@/components/SummaryOptions';
import { ProcessingStatus } from '@/components/ProcessingStatus';
import { DocumentViewer } from '@/components/DocumentViewer';
import { DocumentHistory } from '@/components/DocumentHistory';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';

interface MainAppProps {
  userEmail: string;
  onSignOut: () => void;
}


type ProcessingStage = 'idle' | 'extracting' | 'ready' | 'summarizing' | 'suggestions' | 'complete' | 'error';

export function MainApp({ userEmail, onSignOut }: MainAppProps) {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [view, setView] = useState<'upload' | 'history' | 'document'>('history');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const resetState = () => {
    setCurrentFile(null);
    setExtractedText('');
    setProcessingStage('idle');
    setProgress(0);
    setError('');
    setCurrentDocument(null);
  };

  const handleFileSelect = async (file: File) => {
    resetState();
    setCurrentFile(file);
    setView('upload');

    try {
      setProcessingStage('extracting');
      setProgress(0);

      const text = await extractText(file, (p) => setProgress(Math.round(p)));

      if (!text.trim()) {
        throw new Error('No text could be extracted. Try a clearer scan or higher-quality image.');
      }

      setExtractedText(text);
      setProcessingStage('ready');
      setProgress(100);
    } catch (err: any) {
      setError(err.message || 'Failed to extract text from file.');
      setProcessingStage('error');
    }
  };

  const handleGenerateSummary = async () => {
    if (!extractedText || !currentFile) return;

    try {
      setProcessingStage('summarizing');
      setProgress(10);

      const summary = await generateSummary(extractedText, summaryLength);
      setProgress(70);

      setProcessingStage('suggestions');
      const suggestions = await generateSuggestions(summary, extractedText);
      setProgress(90);

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const documentData = {
        filename: currentFile.name,
        content: extractedText,
        summary,
        suggestions,
        file_type: currentFile.type === 'application/pdf' ? 'pdf' as const : 'image' as const,
        summary_length: summaryLength,
        user_id: user.user.id
      };

      const { data, error: dbError } = await supabase
        .from('documents')
        .insert([documentData])
        .select()
        .single();

      if (dbError) throw dbError;

      setCurrentDocument(data);
      setProcessingStage('complete');
      setProgress(100);
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      setError(err.message || 'Something went wrong during summarization.');
      setProcessingStage('error');
    }
  };

  const handleDocumentSelect = (document: Document) => {
    setCurrentDocument(document);
    setView('document');
  };

  const handleNewUpload = () => {
    resetState();
    setView('upload');
  };

  const handleBackToHistory = () => {
    setView('history');
    setCurrentDocument(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userEmail={userEmail} onSignOut={onSignOut} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            {view !== 'history' && (
              <Button
                variant="outline"
                onClick={handleBackToHistory}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to History</span>
              </Button>
            )}
          </div>
          
          {view !== 'upload' && (
            <Button
              onClick={handleNewUpload}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Document</span>
            </Button>
          )}
        </div>

        {view === 'history' && (
          <DocumentHistory 
            onDocumentSelect={handleDocumentSelect}
            refreshTrigger={refreshTrigger}
          />
        )}

        {view === 'upload' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <FileUpload
                onFileSelect={handleFileSelect}
                isProcessing={processingStage !== 'idle' && processingStage !== 'complete'}
                error={error}
              />
              {extractedText && processingStage === 'ready' && (
  <SummaryOptions
    summaryLength={summaryLength}
    onSummaryLengthChange={setSummaryLength}
    onGenerate={handleGenerateSummary}
    isGenerating={processingStage === 'summarizing' || processingStage === 'suggestions'}
    disabled={!extractedText}
  />
)}

              
            </div>

            <div>
              {currentFile && processingStage !== 'idle' && (
                <ProcessingStatus
                  stage={processingStage}
                  progress={progress}
                  filename={currentFile.name}
                  error={error}
                />
              )}
              
              {currentDocument && (
                <DocumentViewer document={currentDocument} />
              )}
            </div>
          </div>
        )}

        {view === 'document' && currentDocument && (
          <DocumentViewer document={currentDocument} />
        )}
      </main>
    </div>
  );
}
