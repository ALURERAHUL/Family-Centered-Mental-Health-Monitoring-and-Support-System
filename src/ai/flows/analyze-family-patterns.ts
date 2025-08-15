'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing family mood entries and shared calendar data to identify potential stress factors and patterns.
 *
 * - analyzeFamilyPatterns - A function that initiates the analysis process.
 * - AnalyzeFamilyPatternsInput - The input type for the analyzeFamilyPatterns function.
 * - AnalyzeFamilyPatternsOutput - The return type for the analyzeFamilyPatterns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFamilyPatternsInputSchema = z.object({
  moodEntries: z
    .array(
      z.object({
        memberId: z.string().describe('The ID of the family member.'),
        date: z.string().describe('The date of the mood entry (YYYY-MM-DD).'),
        mood: z.string().describe('The mood recorded (e.g., happy, sad, stressed).'),
        notes: z.string().optional().describe('Optional notes about the mood.'),
      })
    )
    .describe('An array of mood entries for family members.'),
  calendarEvents: z
    .array(
      z.object({
        memberId: z.string().describe('The ID of the family member.'),
        date: z.string().describe('The date of the calendar event (YYYY-MM-DD).'),
        event: z.string().describe('The description of the calendar event.'),
      })
    )
    .describe('An array of calendar events for family members.'),
});
export type AnalyzeFamilyPatternsInput = z.infer<typeof AnalyzeFamilyPatternsInputSchema>;

const AnalyzeFamilyPatternsOutputSchema = z.object({
  summary: z.string().describe('A summary of potential stress factors and patterns identified within the family unit.'),
});
export type AnalyzeFamilyPatternsOutput = z.infer<typeof AnalyzeFamilyPatternsOutputSchema>;

export async function analyzeFamilyPatterns(input: AnalyzeFamilyPatternsInput): Promise<AnalyzeFamilyPatternsOutput> {
  return analyzeFamilyPatternsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFamilyPatternsPrompt',
  input: {schema: AnalyzeFamilyPatternsInputSchema},
  output: {schema: AnalyzeFamilyPatternsOutputSchema},
  prompt: `You are an AI assistant designed to analyze family mood entries and shared calendar data to identify potential stress factors and patterns within the family unit.

  Analyze the following mood entries:
  {{#each moodEntries}}
  - Member ID: {{{memberId}}}, Date: {{{date}}}, Mood: {{{mood}}}, Notes: {{{notes}}}
  {{/each}}

  Analyze the following calendar events:
  {{#each calendarEvents}}
  - Member ID: {{{memberId}}}, Date: {{{date}}}, Event: {{{event}}}
  {{/each}}

  Provide a summary of potential stress factors and patterns identified within the family unit. Be concise and focus on actionable insights.
  `, 
});

const analyzeFamilyPatternsFlow = ai.defineFlow(
  {
    name: 'analyzeFamilyPatternsFlow',
    inputSchema: AnalyzeFamilyPatternsInputSchema,
    outputSchema: AnalyzeFamilyPatternsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
