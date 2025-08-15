'use client';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2, Mic } from 'lucide-react';
import { getGuidedMeditationScript, getAudioFromScript } from '@/lib/actions';
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
    const [script, setScript] = useState<string | null>(null);
    const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
    const [isScriptLoading, setIsScriptLoading] = useState(false);
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [customTopic, setCustomTopic] = useState('');
    const [activeTopic, setActiveTopic] = useState('');
    const { isSimplified } = useAppContext();
    const audioRef = useRef<HTMLAudioElement>(null);

    const handleGenerateMeditation = async (topic: string) => {
        if (!topic) return;
        setIsScriptLoading(true);
        setIsAudioLoading(false);
        setError(null);
        setScript(null);
        setAudioDataUri(null);
        setActiveTopic(topic);

        const scriptResult = await getGuidedMeditationScript(topic);
        
        setIsScriptLoading(false);
        if (scriptResult.error) {
            setError(scriptResult.error);
        } else if (scriptResult.script) {
            setScript(scriptResult.script);
            // Now automatically fetch the audio
            setIsAudioLoading(true);
            const audioResult = await getAudioFromScript(scriptResult.script);
            if(audioResult.error) {
                setError(audioResult.error);
            } else {
                setAudioDataUri(audioResult.audioDataUri);
            }
            setIsAudioLoading(false);
        }
    }

    useEffect(() => {
        if (audioDataUri && audioRef.current) {
            audioRef.current.load();
        }
    }, [audioDataUri]);

    const isLoading = isScriptLoading || isAudioLoading;

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
                                     {isScriptLoading && activeTopic === topic && (
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
                                 {isScriptLoading && activeTopic === customTopic ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                 ) : (
                                    <Wand2 className="mr-2 h-4 w-4" />
                                 )}
                                Generate
                            </Button>
                        </div>
                    </div>
                    
                     {isScriptLoading && (
                        <div className="flex flex-col items-center justify-center pt-8 space-y-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">Generating your meditation script...</p>
                        </div>
                    )}

                    {error && <p className="text-destructive text-center pt-8">{error}</p>}
                    
                    {script && !isScriptLoading && (
                        <Card className="mt-6 bg-background">
                             <CardHeader>
                                <CardTitle>Meditation on "{activeTopic}"</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isAudioLoading && (
                                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                        <Loader2 className="h-4 w-4 animate-spin"/>
                                        <span>Generating audio...</span>
                                    </div>
                                )}
                                {audioDataUri && !isAudioLoading && (
                                     <audio ref={audioRef} controls src={audioDataUri} className="w-full mb-4">
                                        Your browser does not support the audio element.
                                    </audio>
                                )}
                                <p className="prose prose-zinc dark:prose-invert max-w-none whitespace-pre-wrap">{script}</p>
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
