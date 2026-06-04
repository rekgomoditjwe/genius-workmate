import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const SummarizeInput = z.object({
  notes: z.string().min(1).max(20000),
});

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SummarizeInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI service unavailable");

    const gateway = createLovableAiGatewayProvider(key);
    const { output } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      output: Output.object({
        schema: z.object({
          summary: z.string(),
          decisions: z.array(z.string()),
          actionItems: z.array(
            z.object({
              task: z.string(),
              owner: z.string(),
              deadline: z.string().optional(),
            })
          ),
          keyTopics: z.array(z.string()),
        }),
      }),
      system:
        "You are an expert executive assistant. Analyze meeting notes and produce a structured output. " +
        "Be concise and actionable. Extract explicit decisions made, concrete action items with suggested owners, " +
        "and key discussion topics. If owner or deadline is unclear, infer from context or mark as 'TBD'.",
      prompt: `Analyze these meeting notes and produce a structured summary:\n\n${data.notes}`,
    });

    return output;
  });

const DraftEmailInput = z.object({
  context: z.string().min(1).max(5000),
  tone: z.enum(["professional", "friendly", "formal", "urgent", "casual"]),
  recipient: z.string().optional(),
});

export const draftEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => DraftEmailInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI service unavailable");

    const gateway = createLovableAiGatewayProvider(key);
    const { output } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      output: Output.object({
        schema: z.object({
          subject: z.string(),
          body: z.string(),
          greeting: z.string(),
          closing: z.string(),
        }),
      }),
      system:
        "You are an expert business communication specialist. Draft professional emails that are clear, " +
        "concise, and appropriate for the specified tone. Adapt language formality, warmth, and directness " +
        "based on the tone. Always include a subject line, greeting, body, and closing.",
      prompt: `Draft a ${data.tone} email.\nContext: ${data.context}\n${data.recipient ? `Recipient: ${data.recipient}` : ""}`,
    });

    return output;
  });

const GenerateTasksInput = z.object({
  description: z.string().min(1).max(5000),
});

export const generateTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateTasksInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI service unavailable");

    const gateway = createLovableAiGatewayProvider(key);
    const { output } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      output: Output.object({
        schema: z.object({
          tasks: z.array(
            z.object({
              title: z.string(),
              priority: z.enum(["high", "medium", "low"]),
              estimatedTime: z.string().optional(),
              category: z.string().optional(),
            })
          ),
          rationale: z.string(),
        }),
      }),
      system:
        "You are a productivity expert. Break down work descriptions into clear, actionable tasks. " +
        "Prioritize based on urgency and impact. Estimate time when possible. Group related tasks by category. " +
        "Provide a brief rationale for the prioritization.",
      prompt: `Break this work description into actionable tasks:\n\n${data.description}`,
    });

    return output;
  });

const ProductivityAssistantInput = z.object({
  prompt: z.string().min(1).max(2000),
});

export const productivityAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ProductivityAssistantInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI service unavailable");

    const gateway = createLovableAiGatewayProvider(key);
    const result = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system:
        "You are a professional productivity coach and workplace automation expert. Help users optimize their workflow, " +
        "manage their time better, improve communication, and automate repetitive tasks. Provide practical, actionable advice. " +
        "Be encouraging but honest about what is achievable. When suggesting tools or methods, explain why they help.",
      prompt: data.prompt,
    });

    return { response: result.text };
  });
