'use server';

/**
 * @fileOverview A Genkit flow for generating guided audio meditations using text-to-speech.
 *
 * - generateGuidedMeditation - A function that creates the audio.
 * - GenerateGuidedMeditationInput - The input type for the function.
 * - GenerateGuidedMeditationOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import wav from 'wav';

const GenerateGuidedMeditationInputSchema = z.object({
  topic: z.string().describe('The topic for the guided meditation (e.g., "releasing stress", "finding focus").'),
});
export type GenerateGuidedMeditationInput = z.infer<typeof GenerateGuidedMeditationInputSchema>;

const GenerateGuidedMeditationOutputSchema = z.object({
  audioDataUri: z.string().describe("The generated audio as a data URI in WAV format. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type GenerateGuidedMeditationOutput = z.infer<typeof GenerateGuidedMeditationOutputSchema>;


export async function generateGuidedMeditation(input: GenerateGuidedMeditationInput): Promise<GenerateGuidedMeditationOutput> {
    return generateGuidedMeditationFlow(input);
}


async function toWav(
    pcmData: Buffer,
    channels = 1,
    rate = 24000,
    sampleWidth = 2
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const writer = new wav.Writer({
        channels,
        sampleRate: rate,
        bitDepth: sampleWidth * 8,
      });
  
      let bufs: any[] = [];
      writer.on('error', reject);
      writer.on('data', function (d) {
        bufs.push(d);
      });
      writer.on('end', function () {
        resolve(Buffer.concat(bufs).toString('base64'));
      });
  
      writer.write(pcmData);
      writer.end();
    });
}


const meditationScriptPrompt = ai.definePrompt({
    name: 'meditationScriptPrompt',
    input: {schema: GenerateGuidedMeditationInputSchema},
    output: {schema: z.object({ script: z.string().describe('The script for the guided meditation.') })},
    prompt: `You are a meditation guide. Write a short, soothing script for a guided meditation on the topic of {{{topic}}}. The script should be about 150-200 words. Use gentle language and include pauses for reflection.`,
});

const generateGuidedMeditationFlow = ai.defineFlow(
    {
        name: 'generateGuidedMeditationFlow',
        inputSchema: GenerateGuidedMeditationInputSchema,
        outputSchema: GenerateGuidedMeditationOutputSchema,
    },
    async (input) => {
        // 1. Generate the meditation script
        const { output: scriptOutput } = await meditationScriptPrompt(input);
        if (!scriptOutput) {
            throw new Error('Could not generate meditation script.');
        }
        const script = scriptOutput.script;
        
        // 2. Convert the script to audio
        const { media } = await ai.generate({
            model: googleAI.model('gemini-2.5-flash-preview-tts'),
            config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Algenib' },
                },
              },
            },
            prompt: script,
          });

        if (!media) {
            throw new Error('no media returned from TTS model');
        }

        const audioBuffer = Buffer.from(
            media.url.substring(media.url.indexOf(',') + 1),
            'base64'
        );

        // 3. Convert PCM audio to WAV format
        const wavBase64 = await toWav(audioBuffer);

        return {
            audioDataUri: `data:audio/wav;base64,${wavBase64}`
        };
    }
);
