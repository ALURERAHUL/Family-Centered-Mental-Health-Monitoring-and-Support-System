'use server';

/**
 * @fileOverview A Genkit flow for generating guided meditation scripts.
 *
 * - generateGuidedMeditationScript - A function that creates the script.
 * - GenerateGuidedMeditationInput - The input type for the function.
 * - GenerateGuidedMeditationOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGuidedMeditationInputSchema = z.object({
  topic: z.string().describe('The topic for the guided meditation (e.g., "releasing stress", "finding focus").'),
});
export type GenerateGuidedMeditationInput = z.infer<typeof GenerateGuidedMeditationInputSchema>;

const GenerateGuidedMeditationOutputSchema = z.object({
  script: z.string().describe('The script for the guided meditation.'),
});
export type GenerateGuidedMeditationOutput = z.infer<typeof GenerateGuidedMeditationOutputSchema>;


export async function generateGuidedMeditationScript(input: GenerateGuidedMeditationInput): Promise<GenerateGuidedMeditationOutput> {
    return generateGuidedMeditationScriptFlow(input);
}


const meditationScriptPrompt = ai.definePrompt({
    name: 'meditationScriptPrompt',
    input: {schema: GenerateGuidedMeditationInputSchema},
    output: {schema: GenerateGuidedMeditationOutputSchema},
    prompt: `You are a meditation guide. Write a short, soothing script for a guided meditation on the topic of {{{topic}}}. The script should be about 150-200 words. Use gentle language and include pauses for reflection.`,
});

const generateGuidedMeditationScriptFlow = ai.defineFlow(
    {
        name: 'generateGuidedMeditationScriptFlow',
        inputSchema: GenerateGuidedMeditationInputSchema,
        outputSchema: GenerateGuidedMeditationOutputSchema,
    },
    async (input) => {
        const { output } = await meditationScriptPrompt(input);
        if (!output) {
            throw new Error('Could not generate meditation script.');
        }
        return { script: output.script };
    }
);
