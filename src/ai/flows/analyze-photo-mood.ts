'use server';

/**
 * @fileOverview A Genkit flow for analyzing a person's mood from a photo.
 *
 * - analyzePhotoMood - A function that handles the photo mood analysis.
 * - AnalyzePhotoMoodInput - The input type for the analyzePhotoMood function.
 * - AnalyzePhotoMoodOutput - The return type for the analyzePhotoMood function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePhotoMoodInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzePhotoMoodInput = z.infer<typeof AnalyzePhotoMoodInputSchema>;

const AnalyzePhotoMoodOutputSchema = z.object({
  mood: z.string().describe("The primary mood detected in the person's facial expression (e.g., happy, sad, anxious, stressed, angry, calm)."),
  analysis: z.string().describe("A brief analysis of the detected mood, explaining potential reasons or observations based on the expression."),
  solution: z.string().describe("A constructive and supportive suggestion or solution to help the person, tailored to the detected mood."),
});
export type AnalyzePhotoMoodOutput = z.infer<typeof AnalyzePhotoMoodOutputSchema>;

export async function analyzePhotoMood(input: AnalyzePhotoMoodInput): Promise<AnalyzePhotoMoodOutput> {
  return analyzePhotoMoodFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePhotoMoodPrompt',
  input: {schema: AnalyzePhotoMoodInputSchema},
  output: {schema: AnalyzePhotoMoodOutputSchema},
  prompt: `You are an expert in analyzing human emotions from facial expressions. You are empathetic and provide helpful, supportive advice.
  
Analyze the provided photo of a person. Identify their primary mood from their facial expression. Provide a concise analysis and a constructive solution.

Photo: {{media url=photoDataUri}}`,
});

const analyzePhotoMoodFlow = ai.defineFlow(
  {
    name: 'analyzePhotoMoodFlow',
    inputSchema: AnalyzePhotoMoodInputSchema,
    outputSchema: AnalyzePhotoMoodOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
