'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Frown, Annoyed, Smile, Meh, HeartPulse, User, MessageSquare } from 'lucide-react';
import { useAppContext } from '@/contexts/app-context';
import { cn } from '@/lib/utils';
import type { Mood } from '@/lib/data';

const moodIcons: Record<Mood, React.ElementType> = {
    happy: Smile,
    calm: HeartPulse,
    meh: Meh,
    sad: Frown,
    angry: Annoyed,
    anxious: Annoyed,
    stressed: Annoyed, 
};

export function RecentActivity() {
    const { isSimplified, familyMembers, moodEntries } = useAppContext();
    const recentMoods = moodEntries.slice(-5).reverse();
    const getMember = (id: string) => familyMembers.find(m => m.id === id);

    return (
        <Card>
            <CardHeader>
                <CardTitle className={cn("flex items-center gap-2", isSimplified && "text-3xl")}>
                    <MessageSquare className="h-6 w-6" />
                    Recent Moods
                </CardTitle>
                <CardDescription className={cn(isSimplified && "text-lg")}>How everyone's been feeling lately.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentMoods.map(entry => {
                        const member = getMember(entry.memberId);
                        const MoodIcon = moodIcons[entry.mood];
                        return (
                            <div key={entry.id} className="flex items-start gap-4">
                                <Avatar className={cn(isSimplified && "h-12 w-12")}>
                                    <AvatarImage src={member?.avatar} alt={member?.name} data-ai-hint={member?.name === 'You' ? 'woman portrait' : member?.name === 'Alex' ? 'man portrait' : member?.name === 'Mia' ? 'girl portrait' : 'boy portrait'} />
                                    <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className={cn("font-semibold", isSimplified && "text-xl")}>{member?.name}</p>
                                        <span className={cn("text-sm text-muted-foreground", isSimplified && "text-base")}>felt</span>
                                        <div className="flex items-center gap-1 text-sm font-medium">
                                            {MoodIcon && <MoodIcon className="h-4 w-4" />}
                                            <span className={cn(isSimplified && "text-base")}>{entry.mood}</span>
                                        </div>
                                    </div>
                                    {entry.notes && <p className={cn("text-muted-foreground text-sm mt-1 p-2 bg-muted/50 rounded-md", isSimplified && "text-base")}>"{entry.notes}"</p>}
                                </div>
                                <span className={cn("text-xs text-muted-foreground", isSimplified && "text-sm")}>{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
