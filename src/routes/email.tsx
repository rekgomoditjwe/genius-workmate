import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { draftEmail } from "@/lib/productivity.functions";

export const Route = createFileRoute("/email")({
  component: EmailAssistant,
});

function EmailAssistant() {
  const [context, setContext] = useState("");
  const [tone, setTone] = useState("professional");
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    subject: string;
    body: string;
    greeting: string;
    closing: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleDraft = async () => {
    if (!context.trim()) return;
    setLoading(true);
    setError("");
    try {
      const data = await draftEmail({
        data: { context, tone: tone as any, recipient: recipient || undefined },
      });
      setResult(data);
    } catch {
      setError("Failed to draft email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!result) return;
    const fullEmail = `${result.greeting}\n\n${result.body}\n\n${result.closing}`;
    await navigator.clipboard.writeText(fullEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toneDescriptions: Record<string, string> = {
    professional: "Clear, respectful, and business-appropriate",
    friendly: "Warm, approachable, and personable",
    formal: "Strict etiquette, full titles, no contractions",
    urgent: "Direct, action-oriented, time-sensitive",
    casual: "Relaxed, conversational, minimal formality",
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Mail className="h-6 w-6 text-primary" />
          Email Assistant
        </h1>
        <p className="mt-1 text-muted-foreground">
          Describe what you need to communicate and let AI draft a polished email in your chosen tone.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Draft Request</CardTitle>
            <CardDescription>
              Describe the purpose and key points of your email.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email Purpose</label>
              <Textarea
                placeholder="Example: I need to request a deadline extension for the Q3 report because the data team needs 2 extra days for validation. I want to be polite but clear about the new timeline."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tone</label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{toneDescriptions[tone]}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Recipient (optional)</label>
              <Input
                placeholder="e.g., Project Manager, Client, Team Lead"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>

            <Button
              onClick={handleDraft}
              disabled={loading || !context.trim()}
              className="w-full bg-primary text-primary-foreground"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Drafting...
                </>
              ) : (
                "Draft Email"
              )}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Drafted Email</CardTitle>
              <CardDescription>Review and copy your AI-drafted email.</CardDescription>
            </div>
            {result && (
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4 rounded-lg bg-muted/50 p-4">
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Subject
                  </span>
                  <p className="mt-1 text-sm font-medium text-foreground">{result.subject}</p>
                </div>
                <div className="border-t border-border pt-4 space-y-3">
                  <p className="text-sm text-foreground">{result.greeting}</p>
                  <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                    {result.body}
                  </p>
                  <p className="text-sm text-foreground">{result.closing}</p>
                </div>
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">
                  Your drafted email will appear here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
