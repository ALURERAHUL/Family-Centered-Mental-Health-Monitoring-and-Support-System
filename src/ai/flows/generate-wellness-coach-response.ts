'use server';

/**
 * @fileOverview A Genkit flow for generating responses from an AI wellness coach.
 *
 * - generateWellnessCoachResponse - A function that generates the response.
 * - GenerateWellnessCoachResponseInput - The input type for the function.
 * - GenerateWellnessCoachResponseOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatMessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});

const GenerateWellnessCoachResponseInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe('The conversation history between the user and the AI coach.'),
  familyContext: z.string().describe('A summary of the family\'s recent mood and calendar data for context.'),
});
export type GenerateWellnessCoachResponseInput = z.infer<typeof GenerateWellnessCoachResponseInputSchema>;

const GenerateWellnessCoachResponseOutputSchema = z.object({
  response: z.string().describe('The AI coach\'s response to the user.'),
});
export type GenerateWellnessCoachResponseOutput = z.infer<typeof GenerateWellnessCoachResponseOutputSchema>;

export async function generateWellnessCoachResponse(input: GenerateWellnessCoachResponseInput): Promise<GenerateWellnessCoachResponseOutput> {
  return generateWellnessCoachResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWellnessCoachResponsePrompt',
  input: {schema: GenerateWellnessCoachResponseInputSchema},
  output: {schema: GenerateWellnessCoachResponseOutputSchema},
  prompt: `You are an AI Family Wellness Coach. Your tone is empathetic, supportive, and knowledgeable. You provide practical, actionable advice based on psychology principles. You are not a therapist and should not provide medical advice, but you can offer guidance and support.

Keep your responses concise and easy to understand. Use markdown for formatting if needed.

Here is some context about the family you are talking to:
{{{familyContext}}}

Here is the conversation history:
{{#each history}}
**{{role}}**: {{{content}}}
{{/each}}

Based on the history and context, provide a helpful response to the user's last message. Address them directly.
`,
});

const generateWellnessCoachResponseFlow = ai.defineFlow(
  {
    name: 'generateWellnessCoachResponseFlow',
    inputSchema: GenerateWellnessCoachResponseInputSchema,
    outputSchema: GenerateWellnessCoachResponseOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
