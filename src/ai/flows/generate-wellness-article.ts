'use server';

/**
 * @fileOverview A Genkit flow for generating a wellness article on a given topic.
 *
 * - generateWellnessArticle - A function that generates the article.
 * - GenerateWellnessArticleInput - The input type for the function.
 * - GenerateWellnessArticleOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWellnessArticleInputSchema = z.object({
  topic: z.string().describe('The topic for the wellness article (e.g., "managing stress", "mindfulness for kids").'),
});
export type GenerateWellnessArticleInput = z.infer<typeof GenerateWellnessArticleInputSchema>;

const GenerateWellnessArticleOutputSchema = z.object({
  title: z.string().describe('The title of the generated article.'),
  content: z.string().describe('The full content of the article, formatted with markdown for readability.'),
});
export type GenerateWellnessArticleOutput = z.infer<typeof GenerateWellnessArticleOutputSchema>;


export async function generateWellnessArticle(input: GenerateWellnessArticleInput): Promise<GenerateWellnessArticleOutput> {
    return generateWellnessArticleFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateWellnessArticlePrompt',
    input: {schema: GenerateWellnessArticleInputSchema},
    output: {schema: GenerateWellnessArticleOutputSchema},
    prompt: `You are an expert in psychology and family wellness. Your goal is to write a helpful, easy-to-understand, and actionable article on the requested topic.

    The article should be supportive, positive, and provide practical tips that a family can implement. Structure the article with a clear title and well-organized content. Use markdown for headings, lists, and bold text to improve readability.
    
    Topic: {{{topic}}}
    
    Generate a wellness article based on this topic.
    `,
});


const generateWellnessArticleFlow = ai.defineFlow(
    {
        name: 'generateWellnessArticleFlow',
        inputSchema: GenerateWellnessArticleInputSchema,
        outputSchema: GenerateWellnessArticleOutputSchema,
    },
    async (input) => {
        const {output} = await prompt(input);
        return output!;
    }
);
