'use client';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Sparkles, Loader2, Plus, Info } from 'lucide-react';
import { useAppContext } from '@/contexts/app-context';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { getCalendarSuggestion } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import type { CalendarEvent } from '@/lib/data';


export default function CalendarPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const { isSimplified, familyMembers, calendarEvents, setCalendarEvents, moodEntries } = useAppContext();
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestion, setSuggestion] = useState<{title: string; reasoning: string} | null>(null);
    const [suggestionError, setSuggestionError] = useState<string | null>(null);
    const { toast } = useToast();

    const getMember = (id: string) => familyMembers.find(m => m.id === id);

    const eventsForSelectedDay = date ? calendarEvents.filter(
        event => format(new Date(event.date + 'T00:00:00'), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    ) : [];
    
    const eventDates = calendarEvents.map(e => new Date(e.date + 'T00:00:00'));

    const handleSuggestEvent = async () => {
        setIsSuggesting(true);
        setSuggestion(null);
        setSuggestionError(null);
        const result = await getCalendarSuggestion(moodEntries, calendarEvents);
        if(result.error) {
            setSuggestionError(result.error);
        } else {
            setSuggestion(result);
        }
        setIsSuggesting(false);
    }

    const handleAddSuggestedEvent = () => {
        if(!suggestion) return;

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const newEvent: CalendarEvent = {
            id: `e${calendarEvents.length + 1}`,
            title: suggestion.title,
            date: format(tomorrow, 'yyyy-MM-dd'),
            allDay: true,
            memberIds: familyMembers.map(m => m.id),
        }
        setCalendarEvents(prev => [...prev, newEvent]);
        setSuggestion(null);
        toast({
            title: 'Event Added!',
            description: `"${suggestion.title}" has been added to your family calendar for tomorrow.`,
        });
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className={cn("text-2xl font-bold", isSimplified && 'text-3xl')}>AI Event Suggestion</CardTitle>
                    <CardDescription className={cn(isSimplified && 'text-lg')}>
                        Let AI analyze your family's recent activity and suggest a fun, connecting event.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Button onClick={handleSuggestEvent} disabled={isSuggesting}>
                        {isSuggesting ? (
                           <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                           </>
                        ) : (
                           <>
                             <Sparkles className="mr-2 h-4 w-4" />
                             Suggest a Family Event
                           </>
                        )}
                    </Button>
                    {suggestionError && <p className="text-destructive">{suggestionError}</p>}
                    {suggestion && (
                        <Alert>
                             <Info className="h-4 w-4" />
                            <AlertTitle className="font-bold">{suggestion.title}</AlertTitle>
                            <AlertDescription className="mt-2">
                                <p className="font-semibold">Why this suggestion?</p>
                                <p className="mb-4">{suggestion.reasoning}</p>
                                 <Button onClick={handleAddSuggestedEvent} size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add to Calendar for Tomorrow
                                </Button>
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                    <Card>
                        <CardContent className="p-0 flex justify-center">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="p-0"
                                classNames={{
                                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                    month: "space-y-4",
                                    table: 'w-full border-collapse space-y-1',
                                    day: cn("h-12 w-12 rounded-full", isSimplified && "h-16 w-16 text-lg"),
                                    head_cell: 'w-12',
                                    cell: cn("w-12 h-12 text-center text-sm p-0 relative first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full focus-within:relative focus-within:z-20", isSimplified && "h-16 w-16 text-lg"),
                                }}
                                modifiers={{
                                    hasEvent: eventDates,
                                }}
                                modifiersStyles={{
                                    hasEvent: {
                                        border: '2px solid hsl(var(--primary))',
                                        borderRadius: '9999px',
                                    },
                                }}
                            />
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className={cn(isSimplified && 'text-3xl')}>
                                Events for {date ? format(date, 'PPP') : 'today'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {eventsForSelectedDay.length > 0 ? (
                                    eventsForSelectedDay.map(event => (
                                        <li key={event.id} className="flex items-start gap-3">
                                            <div className="w-1 h-8 bg-primary rounded-full mt-1 shrink-0"></div>
                                            <div className='flex-1'>
                                                <p className={cn("font-semibold", isSimplified && 'text-xl')}>{event.title}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {event.memberIds.map(id => {
                                                        const member = getMember(id);
                                                        return (
                                                            <Avatar key={id} className={cn("h-6 w-6", isSimplified && 'h-8 w-8')}>
                                                                <AvatarImage src={member?.avatar} alt={member?.name} data-ai-hint={member?.name === 'You' ? 'woman portrait' : member?.name === 'Alex' ? 'man portrait' : member?.name === 'Mia' ? 'girl portrait' : 'boy portrait'} />
                                                                <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                                            </Avatar>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <p className={cn("text-muted-foreground", isSimplified && 'text-lg')}>No events scheduled for this day.</p>
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
