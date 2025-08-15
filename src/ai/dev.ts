'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-family-patterns.ts';
import '@/ai/flows/analyze-photo-mood.ts';
import '@/ai/flows/generate-conversation-starter.ts';
import '@/ai/flows/generate-wellness-article.ts';
