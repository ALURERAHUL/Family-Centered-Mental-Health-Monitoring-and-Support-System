'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { getFamilyPatternAnalysis } from '@/lib/actions';
import { useAppContext } from '@/contexts/app-context';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function AnalysisPage() {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isSimplified } = useAppContext();

    const handleAnalyze = async () => {
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        const result = await getFamilyPatternAnalysis();
        if (result.error) {
            setError(result.error);
        } else if (result.summary) {
            setAnalysis(result.summary);
        }
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col items-center text-center">
            <Card className="w-full max-w-3xl">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                        <Sparkles className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className={cn("text-3xl font-bold mt-4", isSimplified && 'text-4xl')}>AI-Powered Family Insights</CardTitle>
                    <CardDescription className={cn("text-lg text-muted-foreground", isSimplified && 'text-xl')}>
                        Discover patterns and insights from your family's logged moods and events to foster better understanding and support.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Button onClick={handleAnalyze} disabled={isLoading} size="lg" className={cn(isSimplified && 'h-14 text-lg')}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            'Analyze Family Patterns'
                        )}
                    </Button>

                    {error && <p className="text-destructive">{error}</p>}
                    
                    {analysis && (
                        <Card className="text-left bg-background">
                            <CardHeader>
                                <CardTitle className={cn("flex items-center gap-2", isSimplified && 'text-2xl')}>
                                    <Sparkles className="h-5 w-5 text-primary" />
                                    Analysis Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className={cn("whitespace-pre-wrap", isSimplified && 'text-lg')}>{analysis}</p>
                            </CardContent>
                        </Card>
                    )}

                    {!analysis && !isLoading && !error && (
                         <div className="text-center text-muted-foreground pt-8">
                             <Image 
                                src="https://placehold.co/400x300.png"
                                alt="Illustration of family looking at charts"
                                data-ai-hint="family charts"
                                width={400}
                                height={300}
                                className="mx-auto rounded-lg"
                             />
                             <p className={cn("mt-4", isSimplified && 'text-lg')}>Click the button to generate your family's wellness report.</p>
                         </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
