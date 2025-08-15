'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Wand2, BookOpen } from 'lucide-react';
import { getWellnessArticle } from '@/lib/actions';
import { useAppContext } from '@/contexts/app-context';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import type { GenerateWellnessArticleOutput } from '@/ai/flows/generate-wellness-article';

const articleTopics = [
    'Managing Stress',
    'Mindfulness for Kids',
    'Improving Communication',
    'Building Resilience',
    'Digital Wellness for Families'
]

export default function ResourcesPage() {
    const [article, setArticle] = useState<GenerateWellnessArticleOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [customTopic, setCustomTopic] = useState('');
    const [activeTopic, setActiveTopic] = useState('');
    const { isSimplified } = useAppContext();

    const handleGenerateArticle = async (topic: string) => {
        if (!topic) return;
        setIsLoading(true);
        setError(null);
        setArticle(null);
        setActiveTopic(topic);
        const result = await getWellnessArticle(topic);
        if (result.error) {
            setError(result.error);
        } else {
            setArticle(result as GenerateWellnessArticleOutput);
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
                        Generate helpful articles on a variety of wellness topics.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                         <p className={cn("font-semibold text-center", isSimplified && 'text-xl')}>Choose a topic or enter your own:</p>
                         <div className="flex flex-wrap justify-center gap-2">
                            {articleTopics.map(topic => (
                                <Button 
                                    key={topic} 
                                    variant={activeTopic === topic && !article ? 'default' : 'outline'}
                                    onClick={() => handleGenerateArticle(topic)}
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
                                onClick={() => handleGenerateArticle(customTopic)} 
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
                            <p className="text-muted-foreground">Generating your article... this can take a moment.</p>
                        </div>
                    )}

                    {error && <p className="text-destructive text-center pt-8">{error}</p>}
                    
                    {article && !isLoading && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>{article.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                               <ReactMarkdown className="prose prose-zinc dark:prose-invert max-w-none">
                                   {article.content}
                                </ReactMarkdown>
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
