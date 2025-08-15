'use server';

import { analyzeFamilyPatterns, AnalyzeFamilyPatternsInput } from '@/ai/flows/analyze-family-patterns';
import { analyzePhotoMood, AnalyzePhotoMoodInput, AnalyzePhotoMoodOutput } from '@/ai/flows/analyze-photo-mood';
import { generateConversationStarter, GenerateConversationStarterInput } from '@/ai/flows/generate-conversation-starter';
import { type MoodEntry, type CalendarEvent, type FamilyMember, type ForumPost } from './data';

export async function getFamilyPatternAnalysis(memberId: string, familyMembers: FamilyMember[], moodEntries: MoodEntry[], calendarEvents: CalendarEvent[]) {
    try {
        let finalMoodEntries = moodEntries;
        let finalCalendarEvents = calendarEvents;

        if (memberId !== 'all') {
            finalMoodEntries = moodEntries.filter(entry => entry.memberId === memberId);
            finalCalendarEvents = calendarEvents.filter(event => event.memberIds.includes(memberId));
        }
        
        const memberName = memberId === 'all' ? 'the entire family' : familyMembers.find(m => m.id === memberId)?.name;

        const transformedMoodEntries = finalMoodEntries.map(entry => ({
            memberId: entry.memberId,
            date: entry.date,
            mood: entry.mood,
            notes: entry.notes || '',
        }));

        const transformedCalendarEvents = finalCalendarEvents.flatMap(event => 
            event.memberIds.map(memberId => ({
                memberId: memberId,
                date: event.date,
                event: event.title,
            }))
        );

        const input: AnalyzeFamilyPatternsInput = {
            memberToAnalyze: memberName || 'the user',
            moodEntries: transformedMoodEntries,
            calendarEvents: transformedCalendarEvents,
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

export async function getConversationStarter(familyMembers: FamilyMember[], posts: ForumPost[]) {
    try {
        const memberNames = familyMembers.map(m => m.name).join(', ');
        const recentPosts = posts.slice(-3).map(p => {
            const member = familyMembers.find(m => m.id === p.memberId);
            return `${member?.name || 'A family member'} said: "${p.content}"`;
        }).join('\n');

        const context = `The family members are: ${memberNames}.\nRecent posts:\n${recentPosts}`;

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
