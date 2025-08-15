'use server';

/**
 * @fileOverview A Genkit flow for generating audio from a script using text-to-speech.
 *
 * - generateAudioFromScript - A function that creates the audio.
 * - GenerateAudioFromScriptInput - The input type for the function.
 * - GenerateAudioFromScriptOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import wav from 'wav';

const GenerateAudioFromScriptInputSchema = z.object({
  script: z.string().describe('The script to be converted to audio.'),
});
export type GenerateAudioFromScriptInput = z.infer<typeof GenerateAudioFromScriptInputSchema>;

const GenerateAudioFromScriptOutputSchema = z.object({
  audioDataUri: z.string().describe("The generated audio as a data URI in WAV format. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type GenerateAudioFromScriptOutput = z.infer<typeof GenerateAudioFromScriptOutputSchema>;


export async function generateAudioFromScript(input: GenerateAudioFromScriptInput): Promise<GenerateAudioFromScriptOutput> {
    return generateAudioFromScriptFlow(input);
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

const generateAudioFromScriptFlow = ai.defineFlow(
    {
        name: 'generateAudioFromScriptFlow',
        inputSchema: GenerateAudioFromScriptInputSchema,
        outputSchema: GenerateAudioFromScriptOutputSchema,
    },
    async ({ script }) => {
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

        const wavBase64 = await toWav(audioBuffer);

        return {
            audioDataUri: `data:audio/wav;base64,${wavBase64}`
        };
    }
);
