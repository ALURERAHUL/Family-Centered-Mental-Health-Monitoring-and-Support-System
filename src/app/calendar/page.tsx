'use client';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calendarEvents, familyMembers } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { useAppContext } from '@/contexts/app-context';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function CalendarPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const { isSimplified } = useAppContext();
    const getMember = (id: string) => familyMembers.find(m => m.id === id);

    const eventsForSelectedDay = date ? calendarEvents.filter(
        event => format(new Date(event.date + 'T00:00:00'), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    ) : [];
    
    const eventDates = calendarEvents.map(e => new Date(e.date + 'T00:00:00'));

    return (
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
    );
}
