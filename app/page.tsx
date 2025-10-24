'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload } from 'lucide-react';
import ImportDialog from '@/components/ImportDialog';
import { saveAssessment } from '@/lib/utils/storage';
import { AssessmentResponse } from '@/lib/types/assessment';

export default function Home() {
  const router = useRouter();
  const [showImportDialog, setShowImportDialog] = useState(false);

  const handleImportSuccess = (data: AssessmentResponse | Partial<AssessmentResponse>) => {
    saveAssessment(data as AssessmentResponse);
    setShowImportDialog(false);
    router.push('/results');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-block mb-4">
            <Badge className="text-lg px-4 py-2" variant="outline">
              🚀 Heureka Tech Health Framework
            </Badge>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tech Health Assessment
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Measure the real health of your systems and teams. Turn engineering health data into clear business trade-offs.
          </p>
        </header>

        {/* Main CTA Card */}
        <Card className="mb-12 shadow-lg border-2">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Ready to Start Your Assessment?</CardTitle>
            <CardDescription className="text-base">
              This guided assessment takes 20-30 minutes and covers 5 key areas with 22 dimensions
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pb-6">
            <Link href="/assessment">
              <Button size="lg" className="text-lg px-8 py-6">
                Start New Assessment
              </Button>
            </Link>
            <div className="flex items-center gap-3 text-slate-500">
              <div className="h-px bg-slate-300 w-20"></div>
              <span className="text-sm">or</span>
              <div className="h-px bg-slate-300 w-20"></div>
            </div>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={() => setShowImportDialog(true)}
            >
              <Upload className="w-5 h-5" />
              Import Previous Assessment
            </Button>
          </CardContent>
        </Card>

        {showImportDialog && (
          <ImportDialog
            onImportSuccess={handleImportSuccess}
            onClose={() => setShowImportDialog(false)}
          />
        )}

        {/* Framework Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-3xl">🧱</span>
                Tech Debt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Evaluates code quality, architecture, infrastructure, process, and knowledge debt across 5 dimensions
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-3xl">🧪</span>
                Testing & Automation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Measures unit testing, integration testing, E2E coverage, pipeline reliability, and deployment automation
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-3xl">🔍</span>
                Observability & Stability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Assesses monitoring, alerting, incident response, logging, tracing, and learning culture
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-3xl">⚡</span>
                Delivery (DORA)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Tracks deployment frequency, lead time, change failure rate, recovery time, and rollback frequency
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-3xl">🧠</span>
                Governance & Knowledge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Evaluates ADR discipline, decision traceability, architecture docs, ownership, and transparency
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-3xl">💬</span>
                Pulse Survey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Captures team sentiment on tech debt, release process, engineering time, leadership support, and tools
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Core Principles */}
        <Card className="mb-12 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl">Core Principles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">🎯 No Benchmarking</h4>
                <p className="text-sm text-slate-600">
                  Focus on trends, not comparing teams. Your journey is unique.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🔍 Transparency & Ownership</h4>
                <p className="text-sm text-slate-600">
                  Each team owns its Tech Health and defines its own improvement roadmap.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📊 Data-Driven</h4>
                <p className="text-sm text-slate-600">
                  Combine objective metrics with subjective team insights.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🔄 Continuous Improvement</h4>
                <p className="text-sm text-slate-600">
                  Start simple, iterate gradually, and automate over time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maturity Levels */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Maturity Levels</CardTitle>
            <CardDescription>
              Each dimension is scored from 1 (Chaotic) to 4 (Optimized)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <Badge className="bg-red-600 text-white mt-1">1</Badge>
                <div>
                  <h4 className="font-semibold">Chaotic</h4>
                  <p className="text-sm text-slate-600">
                    Ad-hoc, manual, unpredictable processes
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <Badge className="bg-yellow-600 text-white mt-1">2</Badge>
                <div>
                  <h4 className="font-semibold">Emerging</h4>
                  <p className="text-sm text-slate-600">
                    Partial coverage or informal discipline
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <Badge className="bg-green-600 text-white mt-1">3</Badge>
                <div>
                  <h4 className="font-semibold">Defined</h4>
                  <p className="text-sm text-slate-600">
                    Stable processes and metrics for critical flows
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <Badge className="bg-emerald-700 text-white mt-1">4</Badge>
                <div>
                  <h4 className="font-semibold">Optimized</h4>
                  <p className="text-sm text-slate-600">
                    Automated, measurable, continuously improved
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-500">
          <p>
            Engineering you can plan with. •{' '}
            <a
              href="https://github.com/anthropics/claude-code"
              className="underline hover:text-slate-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
