'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-family-patterns.ts';
import '@/ai/flows/analyze-photo-mood.ts';
import '@/ai/flows/generate-conversation-starter.ts';
import '@/ai/flows/generate-wellness-article.ts';
import '@/ai/flows/generate-wellness-coach-response.ts';
import '@/ai/flows/generate-calendar-suggestion.ts';
import '@/ai/flows/generate-guided-meditation.ts';
import '@/ai/flows/generate-audio-from-script.ts';
import '@/ai/tools/emergency-services-tool.ts';
import '@/ai/flows/analyze-communication-patterns.ts';
