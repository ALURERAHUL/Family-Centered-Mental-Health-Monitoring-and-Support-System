'use client';
import { useAppContext } from '@/contexts/app-context';
import { cn } from '@/lib/utils';

export function DashboardGreeting() {
    const { isSimplified } = useAppContext();
    return (
        <div>
            <h1 className={cn('font-headline text-3xl font-bold text-foreground', isSimplified ? 'text-4xl' : '')}>
                Welcome to your Family Space
            </h1>
            <p className={cn('text-muted-foreground mt-2', isSimplified ? 'text-lg' : '')}>
                Here's a look at your family's wellness today.
            </p>
        </div>
    );
}
