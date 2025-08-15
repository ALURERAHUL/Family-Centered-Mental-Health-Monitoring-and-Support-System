'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Smile, BookHeart } from 'lucide-react';
import { useAppContext } from '@/contexts/app-context';
import { cn } from '@/lib/utils';
import { format, subYears } from 'date-fns';

type Memory = {
    type: 'mood' | 'event';
    date: string;
    content: string;
    icon: React.ElementType;
}

export function MemoryLane() {
    const { isSimplified, moodEntries, calendarEvents } = useAppContext();
    const [memory, setMemory] = useState<Memory | null>(null);
    
    useEffect(() => {
        const oneYearAgo = subYears(new Date(), 1);
        const oneYearAgoStr = format(oneYearAgo, 'yyyy-MM-dd');

        const happyMoods = moodEntries.filter(
            e => e.date === oneYearAgoStr && (e.mood === 'happy' || e.mood === 'calm')
        );

        const pastEvents = calendarEvents.filter(
            e => e.date === oneYearAgoStr
        );

        if (happyMoods.length > 0) {
            const randomMood = happyMoods[Math.floor(Math.random() * happyMoods.length)];
            setMemory({
                type: 'mood',
                date: randomMood.date,
                content: `You felt ${randomMood.mood}.${randomMood.notes ? ` You noted: "${randomMood.notes}"` : ''}`,
                icon: Smile,
            });
        } else if (pastEvents.length > 0) {
            const randomEvent = pastEvents[Math.floor(Math.random() * pastEvents.length)];
            setMemory({
                type: 'event',
                date: randomEvent.date,
                content: `You had the event: "${randomEvent.title}"`,
                icon: Calendar,
            });
        }
    }, [moodEntries, calendarEvents]);

    if (!memory) return null;

    return (
        <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
            <CardHeader>
                <CardTitle className={cn("flex items-center gap-2", isSimplified && "text-3xl")}>
                    <BookHeart className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    Memory Lane
                </CardTitle>
                <CardDescription className={cn(isSimplified && "text-lg")}>
                    A look back at this day one year ago...
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-start gap-4">
                    <memory.icon className={cn("h-8 w-8 text-amber-600 dark:text-amber-400 mt-1", isSimplified && "h-10 w-10")} />
                    <div>
                        <p className={cn("font-semibold", isSimplified && "text-xl")}>{memory.content}</p>
                        <p className={cn("text-sm text-muted-foreground", isSimplified && "text-base")}>{format(new Date(memory.date + 'T00:00:00'), 'PPP')}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
