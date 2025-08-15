'use server';

/**
 * @fileOverview A Genkit flow for generating conversation starters for the family forum.
 *
 * - generateConversationStarter - A function that initiates the conversation starter generation.
 * - GenerateConversationStarterInput - The input type for the function.
 * - GenerateConversationStarterOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateConversationStarterInputSchema = z.object({
  familyContext: z.string().describe('A brief summary of the recent family activity or moods to provide context for the conversation starter.'),
});
export type GenerateConversationStarterInput = z.infer<typeof GenerateConversationStarterInputSchema>;

const GenerateConversationStarterOutputSchema = z.object({
  suggestion: z.string().describe('A supportive and engaging conversation starter, question, or message.'),
});
export type GenerateConversationStarterOutput = z.infer<typeof GenerateConversationStarterOutputSchema>;


export async function generateConversationStarter(input: GenerateConversationStarterInput): Promise<GenerateConversationStarterOutput> {
    return generateConversationStarterFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateConversationStarterPrompt',
    input: {schema: GenerateConversationStarterInputSchema},
    output: {schema: GenerateConversationStarterOutputSchema},
    prompt: `You are an AI assistant designed to foster positive family communication. Your goal is to generate a single, thoughtful, and supportive conversation starter, question, or message for a family forum.

    The message should be empathetic and encouraging. It could be a question about someone's day, a message of support, or a fun idea for the family. Avoid generic platitudes.
    
    Here is some context about the family's recent activity:
    {{{familyContext}}}
    
    Generate one conversation starter based on this context.
    `,
});


const generateConversationStarterFlow = ai.defineFlow(
    {
        name: 'generateConversationStarterFlow',
        inputSchema: GenerateConversationStarterInputSchema,
        outputSchema: GenerateConversationStarterOutputSchema,
    },
    async (input) => {
        const {output} = await prompt(input);
        return output!;
    }
);
