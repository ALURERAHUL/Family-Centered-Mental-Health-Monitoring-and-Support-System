'use server';

/**
 * @fileOverview A Genkit flow for analyzing family communication patterns from forum posts.
 *
 * - analyzeCommunicationPatterns - A function that initiates the analysis process.
 * - AnalyzeCommunicationPatternsInput - The input type for the function.
 * - AnalyzeCommunicationPatternsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCommunicationPatternsInputSchema = z.object({
  forumPosts: z
    .array(
      z.object({
        memberName: z.string().describe('The name of the family member who made the post.'),
        content: z.string().describe('The content of the forum post.'),
        timestamp: z.string().describe('The timestamp of the post.'),
      })
    )
    .describe('An array of forum posts to analyze.'),
});
export type AnalyzeCommunicationPatternsInput = z.infer<typeof AnalyzeCommunicationPatternsInputSchema>;

const AnalyzeCommunicationPatternsOutputSchema = z.object({
  analysisSummary: z.string().describe('A comprehensive summary of the family\'s communication patterns, including sentiment, engagement levels, and constructive feedback.'),
});
export type AnalyzeCommunicationPatternsOutput = z.infer<typeof AnalyzeCommunicationPatternsOutputSchema>;

export async function analyzeCommunicationPatterns(input: AnalyzeCommunicationPatternsInput): Promise<AnalyzeCommunicationPatternsOutput> {
  return analyzeCommunicationPatternsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCommunicationPatternsPrompt',
  input: {schema: AnalyzeCommunicationPatternsInputSchema},
  output: {schema: AnalyzeCommunicationPatternsOutputSchema},
  prompt: `You are an expert in family therapy and communication analysis. Your task is to analyze the following family forum posts to identify communication patterns.

Analyze the tone, sentiment (positive, negative, neutral), and engagement levels. Identify who is communicating most, who is responding, and if there are any potential underlying issues or positive trends.
  
Here are the forum posts:
{{#each forumPosts}}
- **{{memberName}}** ({{timestamp}}): "{{content}}"
{{/each}}

Provide a concise, empathetic, and constructive summary of the communication patterns. Offer actionable insights that could help the family improve their communication. Frame your feedback positively.
`,
});

const analyzeCommunicationPatternsFlow = ai.defineFlow(
  {
    name: 'analyzeCommunicationPatternsFlow',
    inputSchema: AnalyzeCommunicationPatternsInputSchema,
    outputSchema: AnalyzeCommunicationPatternsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
