'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { loadAssessment, clearAssessment, exportAssessmentAsJSON, saveAssessment } from '@/lib/utils/storage';
import { calculateResults, getMaturityDescription, getMaturityColor, formatDate } from '@/lib/utils/scoring-logic';
import { AssessmentResponse, AssessmentResults } from '@/lib/types/assessment';
import RadarChart from '@/components/results/RadarChart';
import Recommendations from '@/components/results/Recommendations';
import ImportDialog from '@/components/ImportDialog';
import { Home, Download, Trash2, BarChart3, Upload } from 'lucide-react';

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [response, setResponse] = useState<AssessmentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showImportDialog, setShowImportDialog] = useState(false);

  useEffect(() => {
    const saved = loadAssessment();
    if (!saved || !saved.teamInfo || !saved.scores) {
      router.push('/');
      return;
    }

    const fullResponse = saved as AssessmentResponse;
    setResponse(fullResponse);

    const calculatedResults = calculateResults(fullResponse);
    setResults(calculatedResults);
    setLoading(false);
  }, [router]);

  const handleExportJSON = () => {
    if (response && results) {
      exportAssessmentAsJSON(response, results);
    }
  };

  const handleImportSuccess = (data: AssessmentResponse) => {
    saveAssessment(data);
    setShowImportDialog(false);
    const calculatedResults = calculateResults(data);
    setResponse(data);
    setResults(calculatedResults);
  };

  const handleStartNew = () => {
    if (confirm('Are you sure you want to start a new assessment? This will clear your current data.')) {
      clearAssessment();
      router.push('/');
    }
  };

  if (loading || !results || !response) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Calculating results...</p>
        </div>
      </div>
    );
  }

  const maturityInfo = getMaturityDescription(results.maturityLevel);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Assessment Results</h1>
              <p className="text-slate-600">
                {response.teamInfo.teamName} • {formatDate(response.teamInfo.date)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportJSON} className="gap-2">
                <Download className="w-4 h-4" />
                Export JSON
              </Button>
              <Button variant="outline" onClick={() => setShowImportDialog(true)} className="gap-2">
                <Upload className="w-4 h-4" />
                Import
              </Button>
              <Button variant="outline" onClick={handleStartNew} className="gap-2">
                <Trash2 className="w-4 h-4" />
                New Assessment
              </Button>
              <Link href="/">
                <Button variant="default" className="gap-2">
                  <Home className="w-4 h-4" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Overall Score Card */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-600 mb-2">
                  {results.overall.toFixed(2)}
                </div>
                <div className="text-slate-600">Overall Score</div>
                <div className="text-sm text-slate-500 mt-1">out of 4.0</div>
              </div>
              <div className="text-center">
                <Badge className={`text-lg px-4 py-2 ${getMaturityColor(results.maturityLevel)}`}>
                  {maturityInfo.label}
                </Badge>
                <div className="text-sm text-slate-600 mt-3">
                  {maturityInfo.description}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {results.pulseAverage.toFixed(1)}
                </div>
                <div className="text-slate-600">Pulse Score</div>
                <div className="text-sm text-slate-500 mt-1">out of 10.0</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Action */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Recommended Action
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-slate-700">
              {maturityInfo.action}
            </p>
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Health Across Areas
            </CardTitle>
            <CardDescription>
              Visual breakdown of your team&apos;s health across the 5 assessment areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadarChart areaScores={results.areaScores} />
          </CardContent>
        </Card>

        {/* Area Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Detailed Breakdown by Area</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {results.areaScores.map((areaScore) => (
              <div key={areaScore.areaId} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{areaScore.areaTitle}</h3>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {areaScore.averageScore.toFixed(2)} / 4.0
                  </Badge>
                </div>
                <Progress
                  value={(areaScore.averageScore / 4) * 100}
                  className="h-3"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  {areaScore.subAxisScores.map((subAxis) => (
                    <div
                      key={subAxis.subAxisId}
                      className="flex items-center justify-between p-2 bg-slate-50 rounded"
                    >
                      <span className="text-slate-700 truncate flex-1">
                        {subAxis.subAxisTitle}
                      </span>
                      <Badge
                        variant="secondary"
                        className={`ml-2 ${
                          subAxis.level === 1
                            ? 'bg-red-100 text-red-800'
                            : subAxis.level === 2
                            ? 'bg-yellow-100 text-yellow-800'
                            : subAxis.level === 3
                            ? 'bg-green-100 text-green-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        L{subAxis.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Prioritized Recommendations</CardTitle>
            <CardDescription>
              Based on your assessment, here are the top areas for improvement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Recommendations recommendations={results.recommendations} />
          </CardContent>
        </Card>

        {/* Participants & Notes */}
        {(response.teamInfo.participants.length > 0 || response.teamInfo.notes) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Assessment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {response.teamInfo.participants.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Participants:</h4>
                  <div className="flex flex-wrap gap-2">
                    {response.teamInfo.participants.map((participant, index) => (
                      <Badge key={index} variant="secondary">
                        {participant}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {response.teamInfo.notes && (
                <div>
                  <h4 className="font-semibold mb-2">Notes:</h4>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded">
                    {response.teamInfo.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer Actions */}
        <div className="text-center">
          <p className="text-slate-600 mb-4">
            Assessment completed at {new Date(results.completedAt).toLocaleString()}
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={handleStartNew} variant="outline">
              Start New Assessment
            </Button>
            <Link href="/">
              <Button variant="default">
                Return Home
              </Button>
            </Link>
          </div>
        </div>

        {showImportDialog && (
          <ImportDialog
            onImportSuccess={handleImportSuccess}
            onClose={() => setShowImportDialog(false)}
          />
        )}
      </div>
    </div>
  );
}
