'use server';

import { analyzeFamilyPatterns, AnalyzeFamilyPatternsInput } from '@/ai/flows/analyze-family-patterns';
import { analyzePhotoMood, AnalyzePhotoMoodInput, AnalyzePhotoMoodOutput } from '@/ai/flows/analyze-photo-mood';
import { generateConversationStarter, GenerateConversationStarterInput } from '@/ai/flows/generate-conversation-starter';
import { generateWellnessArticle, GenerateWellnessArticleInput, GenerateWellnessArticleOutput } from '@/ai/flows/generate-wellness-article';
import { generateWellnessCoachResponse, GenerateWellnessCoachResponseInput, GenerateWellnessCoachResponseOutput } from '@/ai/flows/generate-wellness-coach-response';
import { generateCalendarSuggestion, GenerateCalendarSuggestionInput, GenerateCalendarSuggestionOutput } from '@/ai/flows/generate-calendar-suggestion';
import { generateGuidedMeditation, GenerateGuidedMeditationInput, GenerateGuidedMeditationOutput } from '@/ai/flows/generate-guided-meditation';
import { type MoodEntry, type CalendarEvent, type FamilyMember, type ForumPost } from './data';

export async function getFamilyPatternAnalysis(memberId: string, familyMembers: FamilyMember[], moodEntries: MoodEntry[], calendarEvents: CalendarEvent[]) {
    try {
        const memberToAnalyze = memberId === 'all' 
            ? 'the entire family' 
            : familyMembers.find(m => m.id === memberId)?.name;

        if (!memberToAnalyze) {
            return { error: 'Selected member not found.' };
        }

        const relevantMoodEntries = (memberId === 'all'
            ? moodEntries
            : moodEntries.filter(entry => entry.memberId === memberId)
        ).map(entry => ({
            memberId: entry.memberId,
            date: entry.date,
            mood: entry.mood,
            notes: entry.notes || '',
        }));

        const relevantCalendarEvents = (memberId === 'all'
            ? calendarEvents
            : calendarEvents.filter(event => event.memberIds.includes(memberId))
        ).flatMap(event => 
            event.memberIds.map(mId => ({
                memberId: mId,
                date: event.date,
                event: event.title,
            }))
        );

        const input: AnalyzeFamilyPatternsInput = {
            memberToAnalyze: memberToAnalyze,
            moodEntries: relevantMoodEntries,
            calendarEvents: relevantCalendarEvents,
        };

        const result = await analyzeFamilyPatterns(input);
        return { summary: result.summary };
    } catch (error) {
        console.error("Error analyzing family patterns:", error);
        return { error: 'Failed to analyze patterns. Please try again later.' };
    }
}


export async function getPhotoMoodAnalysis(photoDataUri: string): Promise<{error: string} | AnalyzePhotoMoodOutput> {
    try {
        const input: AnalyzePhotoMoodInput = { photoDataUri };
        const result = await analyzePhotoMood(input);
        return result;
    } catch (error) {
        console.error("Error analyzing photo mood:", error);
        return { error: 'Failed to analyze photo. Please try again.' };
    }
}

export async function getConversationStarter(familyMembers: FamilyMember[], posts: ForumPost[], moodEntries: MoodEntry[]) {
    try {
        const getLatestMood = (memberId: string) => {
            return moodEntries
                .filter(entry => entry.memberId === memberId)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        };

        const contextSummary = familyMembers.map(member => {
            const latestMood = getLatestMood(member.id);
            return `${member.name} is currently feeling ${latestMood ? latestMood.mood : 'unknown'}.`;
        }).join(' ');

        const recentPosts = posts.slice(-3).map(p => {
            const member = familyMembers.find(m => m.id === p.memberId);
            return `${member?.name || 'A family member'} said: "${p.content}"`;
        }).join('\n');

        const context = `Here's a summary of the family's current mood: ${contextSummary}\n\nRecent posts:\n${recentPosts}`;

        const input: GenerateConversationStarterInput = {
            familyContext: context,
        };

        const result = await generateConversationStarter(input);
        return { suggestion: result.suggestion };

    } catch (error) {
        console.error("Error generating conversation starter:", error);
        return { error: 'Failed to generate a suggestion. Please try again.' };
    }
}

export async function getWellnessArticle(topic: string): Promise<{error: string} | GenerateWellnessArticleOutput> {
    try {
        const input: GenerateWellnessArticleInput = { topic };
        const result = await generateWellnessArticle(input);
        return result;
    } catch (error) {
        console.error("Error generating wellness article:", error);
        return { error: 'Failed to generate article. Please try again.' };
    }
}

export async function getWellnessCoachResponse(
    history: {role: 'user' | 'model', content: string}[],
    familyMembers: FamilyMember[],
    moodEntries: MoodEntry[], 
    calendarEvents: CalendarEvent[]
): Promise<{error: string} | GenerateWellnessCoachResponseOutput> {
    try {
        const contextSummary = `The family consists of ${familyMembers.map(m => m.name).join(', ')}. Recent moods include: ${moodEntries.slice(-5).map(e => `${familyMembers.find(m=>m.id===e.memberId)?.name} felt ${e.mood}`).join(', ')}. Upcoming events: ${calendarEvents.slice(-5).map(e => e.title).join(', ')}.`;

        const input: GenerateWellnessCoachResponseInput = { 
            history,
            familyContext: contextSummary
        };
        const result = await generateWellnessCoachResponse(input);
        return result;
    } catch (error) {
        console.error("Error getting wellness coach response:", error);
        return { error: 'Failed to get response. Please try again.' };
    }
}

export async function getCalendarSuggestion(
    moodEntries: MoodEntry[], 
    calendarEvents: CalendarEvent[]
): Promise<{error: string} | GenerateCalendarSuggestionOutput> {
    try {
        const input: GenerateCalendarSuggestionInput = {
            moodEntries: moodEntries.slice(-10).map(m => ({...m})),
            calendarEvents: calendarEvents.slice(-10).map(e => ({date: e.date, event: e.title}))
        };
        const result = await generateCalendarSuggestion(input);
        return result;
    } catch (error) {
        console.error("Error generating calendar suggestion:", error);
        return { error: 'Failed to generate suggestion. Please try again.' };
    }
}

export async function getGuidedMeditation(topic: string): Promise<{error: string} | GenerateGuidedMeditationOutput> {
    try {
        const input: GenerateGuidedMeditationInput = { topic };
        const result = await generateGuidedMeditation(input);
        return result;
    } catch (error) {
        console.error("Error generating guided meditation:", error);
        return { error: 'Failed to generate audio. Please try again.' };
    }
}
