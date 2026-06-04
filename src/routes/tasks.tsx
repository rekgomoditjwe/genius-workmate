import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CheckSquare, Loader2, Plus, Trash2, Sparkles, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { generateTasks } from "@/lib/productivity.functions";

export const Route = createFileRoute("/tasks")({
  component: TaskManager,
});

type Task = {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  estimatedTime?: string;
  category?: string;
  completed: boolean;
  createdAt: string;
};

const STORAGE_KEY = "productivityai-tasks";

function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTasks(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setError("");
    try {
      const data = await generateTasks({ data: { description } });
      const newTasks: Task[] = data.tasks.map((t) => ({
        id: crypto.randomUUID(),
        title: t.title,
        priority: t.priority,
        estimatedTime: t.estimatedTime,
        category: t.category,
        completed: false,
        createdAt: new Date().toISOString(),
      }));
      setTasks((prev) => [...newTasks, ...prev]);
      setDescription("");
    } catch {
      setError("Failed to generate tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addManualTask = () => {
    if (!newTaskTitle.trim()) return;
    setTasks((prev) => [
      {
        id: crypto.randomUUID(),
        title: newTaskTitle.trim(),
        priority: "medium",
        completed: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setNewTaskTitle("");
    setShowAdd(false);
  };

  const priorityIcon = (p: string) => {
    switch (p) {
      case "high":
        return <ArrowUp className="h-3 w-3 text-destructive" />;
      case "low":
        return <ArrowDown className="h-3 w-3 text-success" />;
      default:
        return <Minus className="h-3 w-3 text-warning" />;
    }
  };

  const priorityColor = (p: string) => {
    switch (p) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "low":
        return "bg-success/10 text-success border-success/20";
      default:
        return "bg-warning/10 text-warning-foreground border-warning/20";
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="space-y-6 p-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <CheckSquare className="h-6 w-6 text-primary" />
          Task Manager
        </h1>
        <p className="mt-1 text-muted-foreground">
          Describe a project or goal and let AI generate a prioritized task list. Manage everything in one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-foreground">{totalCount}</p>
            <p className="text-sm text-muted-foreground">Total Tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-foreground">{completedCount}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-foreground">{totalCount - completedCount}</p>
            <p className="text-sm text-muted-foreground">Remaining</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Task Generator
          </CardTitle>
          <CardDescription>
            Describe your project, goal, or meeting outcome. AI will break it down into actionable tasks.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Example: I need to launch a new product page by next Friday. I have the copy ready but need to design the layout, set up the landing page in our CMS, create social media graphics, write the launch email, and coordinate with the marketing team for the announcement."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
          <Button
            onClick={handleGenerate}
            disabled={loading || !description.trim()}
            className="bg-primary text-primary-foreground"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Tasks
              </>
            )}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Tasks</CardTitle>
            <CardDescription>Track and manage your AI-generated and manual tasks.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowAdd(!showAdd)}>
            <Plus className="mr-1 h-4 w-4" />
            Add Task
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {showAdd && (
            <div className="flex gap-2">
              <Input
                placeholder="Enter a new task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addManualTask()}
              />
              <Button onClick={addManualTask} size="sm">
                Add
              </Button>
            </div>
          )}

          {tasks.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">
                No tasks yet. Generate tasks with AI or add one manually.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                    task.completed ? "bg-muted/50 opacity-70" : "bg-card"
                  }`}
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleComplete(task.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {task.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className={`text-xs ${priorityColor(task.priority)}`}>
                        <span className="mr-1">{priorityIcon(task.priority)}</span>
                        {task.priority}
                      </Badge>
                      {task.category && (
                        <Badge variant="secondary" className="text-xs">
                          {task.category}
                        </Badge>
                      )}
                      {task.estimatedTime && (
                        <span className="text-xs text-muted-foreground">{task.estimatedTime}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 shrink-0 px-0 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
