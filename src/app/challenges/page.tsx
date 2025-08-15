'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, Circle, Trophy, Star } from 'lucide-react';
import { useAppContext } from '@/contexts/app-context';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { MoodEntry, FamilyMember, ForumPost, CalendarEvent } from '@/lib/data';


const allChallenges = [
    {
        id: 'c1',
        title: '7-Day Mood Logging',
        description: 'Log your mood every day for a week.',
        goal: 7,
        icon: Star,
        getProgress: (moodEntries: MoodEntry[], familyMembers: FamilyMember[]) => {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const userMoods = moodEntries.filter(e => e.memberId === '1' && new Date(e.date) >= oneWeekAgo);
            const uniqueDays = new Set(userMoods.map(e => e.date));
            return Math.min(uniqueDays.size, 7);
        }
    },
    {
        id: 'c2',
        title: 'Family Forum Starter',
        description: 'Post a new message in the family forum.',
        goal: 1,
        icon: Trophy,
        getProgress: (moodEntries: MoodEntry[], familyMembers: FamilyMember[], forumPosts: ForumPost[]) => {
            return forumPosts.some(p => p.memberId === '1') ? 1 : 0;
        }
    },
    {
        id: 'c3',
        title: 'Kind Words',
        description: 'Leave a supportive comment on a family member\'s post.',
        goal: 1,
        icon: Star,
        getProgress: (moodEntries: MoodEntry[], familyMembers: FamilyMember[], forumPosts: ForumPost[]) => {
            // This logic is a bit simplistic, assumes more than one post is a comment.
            // A more robust system would track replies.
            return forumPosts.filter(p => p.memberId === '1').length > 1 ? 1 : 0;
        }
    },
    {
        id: 'c4',
        title: 'Weekly Planner',
        description: 'Add at least one event to the family calendar for the upcoming week.',
        goal: 1,
        icon: Trophy,
        getProgress: (moodEntries: MoodEntry[], familyMembers: FamilyMember[], forumPosts: ForumPost[], calendarEvents: CalendarEvent[]) => {
            const today = new Date();
            const nextWeek = new Date();
            nextWeek.setDate(today.getDate() + 7);
            return calendarEvents.some(e => e.memberIds.includes('1') && new Date(e.date) >= today && new Date(e.date) <= nextWeek) ? 1 : 0;
        }
    }
]

export default function ChallengesPage() {
    const { isSimplified, moodEntries, familyMembers, forumPosts, calendarEvents } = useAppContext();

    const challengesWithProgress = allChallenges.map(c => {
        const progress = c.getProgress(moodEntries, familyMembers, forumPosts, calendarEvents);
        const isCompleted = progress >= c.goal;
        return { ...c, progress, isCompleted };
    });

    const activeChallenges = challengesWithProgress.filter(c => !c.isCompleted);
    const completedChallenges = challengesWithProgress.filter(c => c.isCompleted);

    return (
        <div className="space-y-8">
            <div>
                <h1 className={cn('text-3xl font-bold font-headline', isSimplified && 'text-4xl')}>Family Challenges</h1>
                <p className={cn('text-muted-foreground', isSimplified && 'text-lg')}>Complete challenges to build healthy habits together.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className={cn(isSimplified && 'text-3xl')}>Active Challenges</CardTitle>
                    <CardDescription className={cn(isSimplified && 'text-lg')}>Challenges you are currently working on.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {activeChallenges.length > 0 ? activeChallenges.map(challenge => (
                        <div key={challenge.id} className="flex items-start gap-4">
                            <challenge.icon className={cn("h-10 w-10 text-primary mt-1", isSimplified && "h-12 w-12")} />
                            <div className="flex-1">
                                <p className={cn("font-bold", isSimplified && 'text-2xl')}>{challenge.title}</p>
                                <p className={cn('text-sm text-muted-foreground', isSimplified && 'text-base')}>{challenge.description}</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <Progress value={(challenge.progress / challenge.goal) * 100} className="flex-1" />
                                    <span className={cn("text-sm font-semibold", isSimplified && "text-base")}>{challenge.progress} / {challenge.goal}</span>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <p className={cn("text-muted-foreground text-center py-4", isSimplified && "text-lg")}>You've completed all available challenges! Great job!</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className={cn(isSimplified && 'text-3xl')}>Completed Challenges</CardTitle>
                    <CardDescription className={cn(isSimplified && 'text-lg')}>Keep up the great work!</CardDescription>
                </CardHeader>
                <CardContent>
                   <ul className="space-y-4">
                        {completedChallenges.map(challenge => (
                             <li key={challenge.id} className="flex items-center gap-4 text-muted-foreground">
                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                                <div>
                                    <p className={cn("font-semibold text-foreground", isSimplified && "text-xl")}>{challenge.title}</p>
                                    <p className={cn("text-sm", isSimplified && "text-base")}>Completed!</p>
                                </div>
                             </li>
                        ))}
                   </ul>
                </CardContent>
            </Card>
        </div>
    );
}
