import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Loader2, Lightbulb, Sparkles, HelpCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { researchTopic } from "@/lib/productivity.functions";

export const Route = createFileRoute("/research")({
  component: ResearchAssistant,
});

type Audience = "executive" | "technical" | "general";

type ResearchResult = {
  summary: string;
  keyInsights: string[];
  recommendations: string[];
  simplifiedExplanation: string;
  furtherQuestions: string[];
  caveats: string;
};

function ResearchAssistant() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState<Audience>("general");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState("");

  const handleResearch = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    try {
      const data = await researchTopic({ data: { topic, audience } });
      setResult(data);
    } catch {
      setError("Failed to analyze. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Research Assistant
        </h1>
        <p className="mt-1 text-muted-foreground">
          Paste an article, report, or topic. Get summaries, insights, and plain-language explanations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Source Content</CardTitle>
          <CardDescription>
            Paste text to analyze or describe a topic to research.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 sm:max-w-xs">
            <Label htmlFor="audience">Target audience</Label>
            <Select value={audience} onValueChange={(v) => setAudience(v as Audience)}>
              <SelectTrigger id="audience">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea
            placeholder="Paste an article, research report, or describe a topic you want explained..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={10}
            className="resize-y"
          />
          <Button
            onClick={handleResearch}
            disabled={loading || !topic.trim()}
            className="bg-primary text-primary-foreground"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze"
            )}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <p className="text-xs text-muted-foreground flex items-start gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            AI summaries may contain inaccuracies. Always verify key facts and statistics against primary sources.
          </p>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-foreground">{result.summary}</p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.keyInsights.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {d}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.recommendations.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {d}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Explained Simply</CardTitle>
              <CardDescription>Plain-language version for quick understanding.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                {result.simplifiedExplanation}
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Questions to Explore
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.furtherQuestions.map((q, i) => (
                    <li key={i} className="text-sm text-foreground">
                      {i + 1}. {q}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-900">
                  <AlertTriangle className="h-5 w-5" />
                  Caveats &amp; Limitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-amber-900">{result.caveats}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}