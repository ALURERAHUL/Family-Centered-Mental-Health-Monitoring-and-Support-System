'use client';
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2, Mic } from 'lucide-react';
import { getGuidedMeditation } from '@/lib/actions';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/contexts/app-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meditationTopics = [
    'Releasing Stress',
    'Finding Focus',
    'Morning Gratitude',
    'Winding Down for Sleep',
    'Cultivating Patience'
]

export default function MeditationsPage() {
    const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [customTopic, setCustomTopic] = useState('');
    const [activeTopic, setActiveTopic] = useState('');
    const { isSimplified } = useAppContext();
    const audioRef = useRef<HTMLAudioElement>(null);

    const handleGenerateMeditation = async (topic: string) => {
        if (!topic) return;
        setIsLoading(true);
        setError(null);
        setAudioDataUri(null);
        setActiveTopic(topic);
        const result = await getGuidedMeditation(topic);
        if (result.error) {
            setError(result.error);
        } else {
            setAudioDataUri(result.audioDataUri);
        }
        setIsLoading(false);
    }

    return (
        <div className="space-y-8">
            <Card>
                 <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                        <Mic className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className={cn("text-3xl font-bold mt-4 text-center", isSimplified && 'text-4xl')}>Guided Audio Meditations</CardTitle>
                    <CardDescription className={cn("text-lg text-muted-foreground text-center", isSimplified && 'text-xl')}>
                        Generate a short, guided meditation on a topic of your choice.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                         <p className={cn("font-semibold text-center", isSimplified && 'text-xl')}>Choose a topic or enter your own:</p>
                         <div className="flex flex-wrap justify-center gap-2">
                            {meditationTopics.map(topic => (
                                <Button 
                                    key={topic} 
                                    variant={activeTopic === topic ? 'default' : 'outline'}
                                    onClick={() => handleGenerateMeditation(topic)}
                                    disabled={isLoading}
                                    className={cn(isSimplified && 'h-12 text-lg')}
                                >
                                     {isLoading && activeTopic === topic && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                     )}
                                    {topic}
                                </Button>
                            ))}
                         </div>
                         <div className="flex w-full max-w-sm items-center space-x-2 mx-auto">
                            <Input 
                                type="text" 
                                placeholder="Custom topic..." 
                                value={customTopic}
                                onChange={(e) => setCustomTopic(e.target.value)}
                                disabled={isLoading}
                                className={cn(isSimplified && 'h-12 text-lg')}
                            />
                            <Button 
                                onClick={() => handleGenerateMeditation(customTopic)} 
                                disabled={isLoading || !customTopic}
                                className={cn(isSimplified && 'h-12 text-lg')}
                            >
                                 {isLoading && activeTopic === customTopic ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Wand2 className="mr-2 h-4 w-4" />
                                )}
                                Generate
                            </Button>
                        </div>
                    </div>
                    
                     {isLoading && (
                        <div className="flex flex-col items-center justify-center pt-8 space-y-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">Generating your meditation... this may take a moment.</p>
                        </div>
                    )}

                    {error && <p className="text-destructive text-center pt-8">{error}</p>}
                    
                    {audioDataUri && !isLoading && (
                        <div className="pt-8">
                           <h3 className="text-center font-bold text-lg mb-4">Meditation on "{activeTopic}"</h3>
                           <audio ref={audioRef} controls src={audioDataUri} className="w-full">
                                Your browser does not support the audio element.
                           </audio>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
