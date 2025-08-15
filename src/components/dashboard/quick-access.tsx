
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, HeartPulse, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useAppContext } from '@/contexts/app-context';
import { cn } from '@/lib/utils';

const accessItems = [
    {
        href: '/',
        title: 'Log Mood',
        description: 'Check in with your feelings.',
        icon: HeartPulse,
        cta: 'Log Mood',
    },
    {
        href: '/calendar',
        title: 'View Calendar',
        description: 'See upcoming family events.',
        icon: Calendar,
        cta: 'View Calendar',
    },
    {
        href: '/forum',
        title: 'Family Forum',
        description: 'Connect with your loved ones.',
        icon: MessageSquare,
        cta: 'Go to Forum',
    },
];

export function QuickAccess() {
    const { isSimplified } = useAppContext();
    return (
        <div>
            <h2 className={cn("text-2xl font-bold tracking-tight mb-4", isSimplified && "text-3xl")}>Quick Access</h2>
            <div className="grid gap-4 md:grid-cols-3">
                {accessItems.map((item) => (
                    <Card key={item.title}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className={cn("text-sm font-medium", isSimplified && "text-base")}>{item.title}</CardTitle>
                            <item.icon className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className={cn("text-xs text-muted-foreground", isSimplified && "text-sm")}>{item.description}</p>
                            <Button asChild size="sm" className="mt-4 w-full">
                                <Link href={item.href}>{item.cta}</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
