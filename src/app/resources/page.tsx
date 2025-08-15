'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen, Wand2 } from 'lucide-react';
import { getWellnessArticle } from '@/lib/actions';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/contexts/app-context';
import ReactMarkdown from 'react-markdown';


const articleTopics = [
    'Managing Stress as a Family',
    'Tips for Mindful Communication',
    'Building Emotional Resilience in Children',
    'The Importance of Quality Family Time',
    'Navigating Conflict with a Partner',
    'Simple Mindfulness Exercises for a Busy Parent'
]

export default function ResourcesPage() {
    const [article, setArticle] = useState<{title: string, content: string} | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTopic, setActiveTopic] = useState<string | null>(null);
    const { isSimplified } = useAppContext();

    const handleGenerateArticle = async (topic: string) => {
        setIsLoading(true);
        setError(null);
        setArticle(null);
        setActiveTopic(topic);
        const result = await getWellnessArticle(topic);
        if (result.error) {
            setError(result.error);
        } else {
            setArticle(result);
        }
        setIsLoading(false);
    }

    return (
        <div className="space-y-8">
            <Card>
                 <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                        <BookOpen className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className={cn("text-3xl font-bold mt-4 text-center", isSimplified && 'text-4xl')}>Wellness Resource Center</CardTitle>
                    <CardDescription className={cn("text-lg text-muted-foreground text-center", isSimplified && 'text-xl')}>
                        Explore AI-generated articles on topics to support your family's well-being.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center">
                         <p className={cn("font-semibold mb-4", isSimplified && 'text-xl')}>Choose a topic to generate an article:</p>
                         <div className="flex flex-wrap justify-center gap-2">
                            {articleTopics.map(topic => (
                                <Button 
                                    key={topic} 
                                    variant={activeTopic === topic ? 'default' : 'outline'}
                                    onClick={() => handleGenerateArticle(topic)}
                                    disabled={isLoading}
                                    className={cn(isSimplified && 'h-12 text-lg')}
                                >
                                     {isLoading && activeTopic === topic ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Wand2 className="mr-2 h-4 w-4" />
                                    )}
                                    {topic}
                                </Button>
                            ))}
                         </div>
                    </div>
                    
                     {isLoading && (
                        <div className="flex flex-col items-center justify-center pt-8 space-y-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">Generating your article...</p>
                        </div>
                    )}

                    {error && <p className="text-destructive text-center pt-8">{error}</p>}
                    
                    {article && !isLoading && (
                        <Card className="text-left bg-background mt-8">
                            <CardHeader>
                                <CardTitle className={cn("text-2xl", isSimplified && 'text-3xl')}>{article.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="prose prose-zinc dark:prose-invert max-w-none">
                                <ReactMarkdown>{article.content}</ReactMarkdown>
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
