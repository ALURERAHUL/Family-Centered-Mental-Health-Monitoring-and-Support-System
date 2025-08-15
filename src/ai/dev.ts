'use server';
import { config } from 'dotenv';
config();

import './flows/analyze-family-patterns.ts';
import './flows/analyze-photo-mood.ts';
import './flows/generate-conversation-starter.ts';
import './flows/generate-wellness-article.ts';
import './flows/generate-wellness-coach-response.ts';
import './flows/generate-calendar-suggestion.ts';
import './flows/generate-guided-meditation.ts';
import './flows/generate-audio-from-script.ts';
import './tools/emergency-services-tool.ts';
import './flows/analyze-communication-patterns.ts';
