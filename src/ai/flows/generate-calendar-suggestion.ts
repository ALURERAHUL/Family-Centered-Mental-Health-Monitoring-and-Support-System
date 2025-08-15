'use server';

/**
 * @fileOverview A Genkit flow for suggesting a new calendar event based on family data.
 *
 * - generateCalendarSuggestion - A function that initiates the suggestion process.
 * - GenerateCalendarSuggestionInput - The input type for the function.
 * - GenerateCalendarSuggestionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCalendarSuggestionInputSchema = z.object({
  moodEntries: z
    .array(
      z.object({
        memberId: z.string(),
        date: z.string(),
        mood: z.string(),
      })
    )
    .describe('An array of mood entries for family members.'),
  calendarEvents: z
    .array(
      z.object({
        date: z.string(),
        event: z.string(),
      })
    )
    .describe('An array of calendar events for family members.'),
});
export type GenerateCalendarSuggestionInput = z.infer<typeof GenerateCalendarSuggestionInputSchema>;

const GenerateCalendarSuggestionOutputSchema = z.object({
  title: z.string().describe('The title of the suggested calendar event.'),
  reasoning: z.string().describe('A short, friendly explanation for why this event is being suggested.'),
});
export type GenerateCalendarSuggestionOutput = z.infer<typeof GenerateCalendarSuggestionOutputSchema>;


export async function generateCalendarSuggestion(input: GenerateCalendarSuggestionInput): Promise<GenerateCalendarSuggestionOutput> {
    return generateCalendarSuggestionFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateCalendarSuggestionPrompt',
    input: {schema: GenerateCalendarSuggestionInputSchema},
    output: {schema: GenerateCalendarSuggestionOutputSchema},
    prompt: `You are an AI assistant designed to help families connect and improve their well-being. Your task is to suggest a new, positive family event for their calendar.

    Analyze the provided mood entries and existing calendar events to understand the family's current state. For example, if you see a lot of "stressed" or "anxious" moods, suggest a relaxing activity. If the calendar is empty, suggest a fun outing. If the calendar is busy, suggest something low-key.
    
    The event should be for the entire family. The title should be short and engaging. The reasoning should be brief, warm, and encouraging.
    
    Here is the family's data:
    {{#if moodEntries}}
    Recent Moods:
    {{#each moodEntries}}
    - On {{{date}}}, a family member felt {{{mood}}}.
    {{/each}}
    {{/if}}

    {{#if calendarEvents}}
    Upcoming Events:
    {{#each calendarEvents}}
    - On {{{date}}}: {{{event}}}
    {{/each}}
    {{/if}}

    Generate one calendar event suggestion based on this data.
    `,
});


const generateCalendarSuggestionFlow = ai.defineFlow(
    {
        name: 'generateCalendarSuggestionFlow',
        inputSchema: GenerateCalendarSuggestionInputSchema,
        outputSchema: GenerateCalendarSuggestionOutputSchema,
    },
    async (input) => {
        const {output} = await prompt(input);
        return output!;
    }
);
