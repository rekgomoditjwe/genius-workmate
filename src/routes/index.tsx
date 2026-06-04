import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileText,
  Mail,
  CheckSquare,
  Bot,
  Clock,
  TrendingUp,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const tools = [
  {
    title: "Meeting Summarizer",
    description: "Turn meeting notes into structured summaries with action items and decisions.",
    icon: FileText,
    url: "/meetings",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Email Assistant",
    description: "Draft professional emails in any tone — professional, friendly, formal, or urgent.",
    icon: Mail,
    url: "/email",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Task Manager",
    description: "Generate prioritized task lists from descriptions with time estimates.",
    icon: CheckSquare,
    url: "/tasks",
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Research Assistant",
    description: "Summarize articles, extract insights, and simplify complex topics for any audience.",
    icon: BookOpen,
    url: "/research",
    color: "bg-rose-50 text-rose-600",
  },
  {
    title: "AI Assistant",
    description: "Get productivity coaching, workflow optimization, and workplace advice.",
    icon: Bot,
    url: "/assistant",
    color: "bg-violet-50 text-violet-600",
  },
];

const stats = [
  { label: "Time Saved", value: "12+ hrs/wk", icon: Clock },
  { label: "Productivity Gain", value: "40%", icon: TrendingUp },
];

function Dashboard() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome to ProductivityAI
        </h1>
        <p className="mt-2 text-muted-foreground">
          Automate your workplace tasks with AI-powered tools designed for busy professionals.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Productivity Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <Link key={tool.title} to={tool.url} className="block group">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/30">
                <CardHeader className="pb-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tool.color}`}>
                    <tool.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base mt-3">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {tool.description}
                  </CardDescription>
                  <div className="mt-4 flex items-center text-sm font-medium text-primary group-hover:underline">
                    Open tool <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            ProductivityAI leverages advanced prompt engineering and responsible AI practices to deliver reliable workplace automation.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <div className="text-sm font-semibold text-foreground">1. Input Your Content</div>
            <p className="text-sm text-muted-foreground">
              Paste meeting notes, describe an email, or outline a project. No complex setup required.
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-semibold text-foreground">2. AI Processes &amp; Structures</div>
            <p className="text-sm text-muted-foreground">
              Our optimized prompts extract key information, generate actionable outputs, and maintain professional tone.
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-semibold text-foreground">3. Review &amp; Use</div>
            <p className="text-sm text-muted-foreground">
              Get structured, editable results. Copy, modify, or save directly — you stay in control of every output.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
