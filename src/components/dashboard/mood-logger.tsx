'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Mood } from '@/lib/data';
import { Frown, Annoyed, Smile, Meh, HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/contexts/app-context';

const moodOptions: { mood: Mood; label: string; icon: React.ElementType }[] = [
  { mood: 'happy', label: 'Happy', icon: Smile },
  { mood: 'calm', label: 'Calm', icon: HeartPulse },
  { mood: 'meh', label: 'Meh', icon: Meh },
  { mood: 'sad', label: 'Sad', icon: Frown },
  { mood: 'stressed', label: 'Stressed', icon: Annoyed },
];

export function MoodLogger() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();
  const { isSimplified } = useAppContext();

  const handleSubmit = () => {
    if (!selectedMood) {
      toast({
        title: 'Select a mood',
        description: 'Please select a mood before logging.',
        variant: 'destructive',
      });
      return;
    }
    console.log({ mood: selectedMood, notes });
    toast({
      title: 'Mood logged!',
      description: `You've logged your mood as ${selectedMood}.`,
    });
    setSelectedMood(null);
    setNotes('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn(isSimplified && "text-3xl")}>How are you feeling today?</CardTitle>
        <CardDescription className={cn(isSimplified && "text-lg")}>Select a mood and add a note if you'd like.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap justify-center gap-4">
          {moodOptions.map(({ mood, label, icon: Icon }) => (
            <div key={mood} className="flex flex-col items-center gap-2">
              <Button
                variant={selectedMood === mood ? 'default' : 'outline'}
                size="icon"
                className={cn('h-16 w-16 rounded-full', isSimplified && 'h-20 w-20')}
                onClick={() => setSelectedMood(mood)}
              >
                <Icon className={cn('h-8 w-8', isSimplified && 'h-10 w-10')} />
              </Button>
              <span className={cn('text-sm text-muted-foreground', isSimplified && 'text-base')}>{label}</span>
            </div>
          ))}
        </div>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add a private note to remember this moment..."
          className={cn(isSimplified && "min-h-[120px] text-lg")}
        />
        <Button onClick={handleSubmit} className={cn('w-full', isSimplified && 'h-12 text-lg')}>
          Log My Mood
        </Button>
      </CardContent>
    </Card>
  );
}
