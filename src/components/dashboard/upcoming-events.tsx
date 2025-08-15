'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppContext } from '@/contexts/app-context';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function UpcomingEvents() {
    const { isSimplified, familyMembers, calendarEvents } = useAppContext();
    const today = new Date();
    today.setHours(0,0,0,0);
    const upcoming = calendarEvents
        .filter(event => new Date(event.date + 'T00:00:00') >= today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3);

    const getMember = (id: string) => familyMembers.find(m => m.id === id);

    return (
        <Card>
            <CardHeader>
                <CardTitle className={cn("flex items-center gap-2", isSimplified && "text-3xl")}>
                    <Calendar className="h-6 w-6" />
                    Upcoming Events
                </CardTitle>
                <CardDescription className={cn(isSimplified && "text-lg")}>What's happening in the family.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {upcoming.map(event => (
                        <li key={event.id} className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                                <span className={cn("font-bold text-primary", isSimplified && "text-xl")}>{format(new Date(event.date + 'T00:00:00'), 'dd')}</span>
                                <span className={cn("text-sm text-muted-foreground", isSimplified && "text-base")}>{format(new Date(event.date + 'T00:00:00'), 'MMM')}</span>
                            </div>
                            <div className="flex-1">
                                <p className={cn("font-semibold", isSimplified && "text-xl")}>{event.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    {event.memberIds.map(id => {
                                        const member = getMember(id);
                                        return (
                                            <Avatar key={id} className={cn("h-6 w-6", isSimplified && "h-8 w-8")}>
                                                <AvatarImage src={member?.avatar} alt={member?.name} data-ai-hint={member?.name === 'You' ? 'woman portrait' : member?.name === 'Alex' ? 'man portrait' : member?.name === 'Mia' ? 'girl portrait' : 'boy portrait'} />
                                                <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                            </Avatar>
                                        )
                                    })}
                                </div>
                            </div>
                        </li>
                    ))}
                    {upcoming.length === 0 && <p className="text-muted-foreground">No upcoming events.</p>}
                </ul>
            </CardContent>
        </Card>
    );
}
