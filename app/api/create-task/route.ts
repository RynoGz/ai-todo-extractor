import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { openai } from "@/lib/openai";
import { z } from "zod";

const TaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  due_date: z.string().nullable(),
});

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    if (!input) {
      return NextResponse.json(
        { error: "Input is required" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0, // 🔥 makes output more deterministic
      messages: [
        {
          role: "system",
          content: `
You are a task extraction assistant.

Current datetime is: ${now}

Extract structured task data from the user's input.

Rules:
- Convert relative dates like "tomorrow" into a full ISO 8601 datetime string.
- Use the current datetime provided above to calculate relative dates.
- If no date is provided, return null for due_date.
- due_date must be in ISO 8601 format like: 2026-03-04T18:00:00Z
- Return only valid JSON matching the schema.
`,
        },
        {
          role: "user",
          content: input,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "task",
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              due_date: {
                anyOf: [{ type: "string" }, { type: "null" }],
              },
            },
            required: ["title", "description", "due_date"],
            additionalProperties: false,
          },
        },
      },
    });

    const raw = completion.choices[0].message.content;

    if (!raw) {
      throw new Error("No response from OpenAI");
    }

    const parsed = TaskSchema.parse(JSON.parse(raw));

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          ...parsed,
          raw_input: input,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("FULL ERROR:", error);

    return NextResponse.json(
      { error: error?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}