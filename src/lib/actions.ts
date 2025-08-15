'use server';

import { analyzeFamilyPatterns, AnalyzeFamilyPatternsInput } from '@/ai/flows/analyze-family-patterns';
import { moodEntries, calendarEvents, familyMembers } from './data';

export async function getFamilyPatternAnalysis(memberId: string) {
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
