'use server';

import { analyzeFamilyPatterns, AnalyzeFamilyPatternsInput } from '@/ai/flows/analyze-family-patterns';
import { moodEntries, calendarEvents } from './data';

export async function getFamilyPatternAnalysis() {
    try {
        const transformedMoodEntries = moodEntries.map(entry => ({
            memberId: entry.memberId,
            date: entry.date,
            mood: entry.mood,
            notes: entry.notes || '',
        }));

        const transformedCalendarEvents = calendarEvents.flatMap(event => 
            event.memberIds.map(memberId => ({
                memberId: memberId,
                date: event.date,
                event: event.title,
            }))
        );

        const input: AnalyzeFamilyPatternsInput = {
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
