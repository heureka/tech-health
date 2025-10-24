'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import { AssessmentResponse } from '@/lib/types/assessment';

interface ImportDialogProps {
  onImportSuccess: (data: AssessmentResponse | Partial<AssessmentResponse>) => void;
  onClose: () => void;
}

interface ExportedData {
  assessment: AssessmentResponse | Partial<AssessmentResponse>;
  results?: unknown;
  status?: 'in-progress' | 'completed';
  exportedAt: string;
}

export default function ImportDialog({ onImportSuccess, onClose }: ImportDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isInProgress, setIsInProgress] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateImportedData = (data: unknown): data is ExportedData => {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON format');
    }

    const exportData = data as Partial<ExportedData>;

    if (!exportData.assessment) {
      throw new Error('Missing assessment data');
    }

    const assessment = exportData.assessment;

    // For in-progress assessments, require at least team name
    if (!assessment.teamInfo || !assessment.teamInfo.teamName) {
      throw new Error('Missing team name - at least team information is required');
    }

    // Scores and pulseScores can be partial/empty for in-progress assessments
    // Just validate they are objects if present
    if (assessment.scores && typeof assessment.scores !== 'object') {
      throw new Error('Invalid scores data format');
    }

    if (assessment.pulseScores && typeof assessment.pulseScores !== 'object') {
      throw new Error('Invalid pulse scores data format');
    }

    return true;
  };

  const handleFile = async (file: File) => {
    setError(null);
    setSuccess(false);
    setIsInProgress(false);

    if (!file.name.endsWith('.json')) {
      setError('Please select a JSON file');
      return;
    }

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (validateImportedData(data)) {
        // Check if it's an in-progress (draft) assessment
        // A draft is identified by:
        // 1. Explicit status: "in-progress" (new format)
        // 2. Missing results object (old complete exports always have results)
        // 3. Empty scores object (nothing filled in yet)
        const isDraft = data.status === 'in-progress' ||
          !data.results ||
          (!!data.assessment.scores && Object.keys(data.assessment.scores).length === 0);

        // Old complete exports have both assessment AND results
        // New drafts have only assessment with status: "in-progress"
        setIsInProgress(!!isDraft);
        setSuccess(true);
        setTimeout(() => {
          onImportSuccess(data.assessment);
        }, 500);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to parse JSON file');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Import Assessment</CardTitle>
              <CardDescription>
                Upload a previously exported assessment JSON file
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-300 hover:border-slate-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />

            {success ? (
              <div className="space-y-4">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                <div>
                  <p className="font-semibold text-green-700">Import successful!</p>
                  <p className="text-sm text-slate-600">
                    {isInProgress
                      ? 'Loading draft assessment...'
                      : 'Loading results...'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-slate-400 mx-auto" />
                <div>
                  <p className="font-semibold mb-1">Drop your JSON file here</p>
                  <p className="text-sm text-slate-600">or</p>
                </div>
                <Button onClick={handleButtonClick} variant="outline">
                  Select File
                </Button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="font-semibold text-red-700 text-sm">Import failed</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-sm text-slate-600">
            <p className="font-semibold mb-2">Expected format:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>JSON file exported from this application</li>
              <li>Completed assessments OR draft (in-progress) exports</li>
              <li>Drafts will open in the assessment page to continue</li>
              <li>Completed assessments will show results immediately</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
