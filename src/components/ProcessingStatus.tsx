import React from 'react';
import { Loader2, FileText, Brain, CheckCircle, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProcessingStatusProps {
  stage: 'extracting' | 'summarizing' | 'suggestions' | 'complete' | 'error';
  progress: number;
  filename: string;
  error?: string;
}

export function ProcessingStatus({ stage, progress, filename, error }: ProcessingStatusProps) {
  const stages = [
    {
      key: 'extracting',
      label: 'Extracting Text',
      icon: FileText,
      description: 'Reading document content...'
    },
    {
      key: 'summarizing',
      label: 'Generating Summary',
      icon: Brain,
      description: 'Creating intelligent summary...'
    },
    {
      key: 'suggestions',
      label: 'Analyzing Improvements',
      icon: Brain,
      description: 'Generating improvement suggestions...'
    }
  ];

  const currentStageIndex = stages.findIndex(s => s.key === stage);
  const isComplete = stage === 'complete';
  const hasError = stage === 'error';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {hasError ? (
            <AlertCircle className="w-5 h-5 text-red-500" />
          ) : isComplete ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          )}
          <span className="text-lg">
            {hasError ? 'Processing Failed' : isComplete ? 'Processing Complete' : 'Processing Document'}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          File: <span className="font-medium">{filename}</span>
        </p>

        {hasError ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-4">
              {stages.map((stageInfo, index) => {
                const isActive = index === currentStageIndex;
                const isCompleted = index < currentStageIndex || isComplete;
                const StageIcon = stageInfo.icon;

                return (
                  <div
                    key={stageInfo.key}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-md transition-colors",
                      isActive ? "bg-blue-50 border border-blue-200" : 
                      isCompleted ? "bg-green-50 border border-green-200" : 
                      "bg-gray-50"
                    )}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full",
                      isCompleted ? "bg-green-500" : isActive ? "bg-blue-500" : "bg-gray-300"
                    )}>
                      {isActive && !isComplete ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      ) : isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <StageIcon className="w-4 h-4 text-white" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className={cn(
                        "font-medium",
                        isActive ? "text-blue-700" : 
                        isCompleted ? "text-green-700" : 
                        "text-gray-600"
                      )}>
                        {stageInfo.label}
                      </p>
                      <p className="text-xs text-gray-500">{stageInfo.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {!isComplete && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}