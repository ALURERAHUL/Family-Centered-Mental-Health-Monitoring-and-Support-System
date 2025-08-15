'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, User } from 'lucide-react';
import { getFamilyPatternAnalysis } from '@/lib/actions';
import { useAppContext } from '@/contexts/app-context';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { familyMembers } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AnalysisPage() {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedMemberId, setSelectedMemberId] = useState<string>('all');
    const { isSimplified } = useAppContext();

    const handleAnalyze = async () => {
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        const result = await getFamilyPatternAnalysis(selectedMemberId);
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
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                            <SelectTrigger className={cn("w-full sm:w-[280px]", isSimplified && 'h-14 text-lg')}>
                                <SelectValue placeholder="Select a family member" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2 overflow-hidden">
                                            {familyMembers.slice(0,4).map(member => (
                                                <Avatar key={member.id} className='h-6 w-6 border-2 border-background'>
                                                     <AvatarImage src={member.avatar} alt={member.name} />
                                                     <AvatarFallback><User /></AvatarFallback>
                                                </Avatar>
                                            ))}
                                        </div>
                                        <span>All Family Members</span>
                                    </div>
                                </SelectItem>
                                {familyMembers.map((member) => (
                                    <SelectItem key={member.id} value={member.id}>
                                       <div className="flex items-center gap-2">
                                            <Avatar className='h-6 w-6'>
                                                <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.name === 'You' ? 'woman portrait' : member.name === 'Alex' ? 'man portrait' : member.name === 'Mia' ? 'girl portrait' : 'boy portrait'}/>
                                                <AvatarFallback><User /></AvatarFallback>
                                            </Avatar>
                                            <span>{member.name}</span>
                                       </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleAnalyze} disabled={isLoading} size="lg" className={cn("w-full sm:w-auto", isSimplified && 'h-14 text-lg')}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                'Analyze Patterns'
                            )}
                        </Button>
                    </div>

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
                             <p className={cn("mt-4", isSimplified && 'text-lg')}>Select a member and click the button to generate a wellness report.</p>
                         </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
