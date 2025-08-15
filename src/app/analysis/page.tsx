'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, User, Camera, Upload } from 'lucide-react';
import { getFamilyPatternAnalysis, getPhotoMoodAnalysis } from '@/lib/actions';
import { useAppContext } from '@/contexts/app-context';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { familyMembers } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import type { AnalyzePhotoMoodOutput } from '@/ai/flows/analyze-photo-mood';

export default function AnalysisPage() {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedMemberId, setSelectedMemberId] = useState<string>('all');

    const [photoAnalysis, setPhotoAnalysis] = useState<AnalyzePhotoMoodOutput | null>(null);
    const [isPhotoLoading, setIsPhotoLoading] = useState(false);
    const [photoError, setPhotoError] = useState<string | null>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { isSimplified } = useAppContext();
    const { toast } = useToast();

    useEffect(() => {
        const getCameraPermission = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({video: true});
            setHasCameraPermission(true);
    
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera permissions in your browser settings to use this feature.',
            });
          }
        };
    
        getCameraPermission();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        }
      }, [toast]);

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

    const handleTakePhotoAndAnalyze = async () => {
        if (!videoRef.current || !canvasRef.current) return;
        setIsPhotoLoading(true);
        setPhotoError(null);
        setPhotoAnalysis(null);

        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const photoDataUri = canvas.toDataURL('image/jpeg');
            const result = await getPhotoMoodAnalysis(photoDataUri);

            if (result.error) {
                setPhotoError(result.error);
            } else {
                setPhotoAnalysis(result);
            }
        }
        setIsPhotoLoading(false);
    };

    return (
        <div className="space-y-8">
            <Card className="w-full">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                        <Sparkles className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className={cn("text-3xl font-bold mt-4 text-center", isSimplified && 'text-4xl')}>AI-Powered Family Insights</CardTitle>
                    <CardDescription className={cn("text-lg text-muted-foreground text-center", isSimplified && 'text-xl')}>
                        Discover patterns and insights from your family's logged moods and events.
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
                                'Analyze Logged Patterns'
                            )}
                        </Button>
                    </div>

                    {error && <p className="text-destructive text-center">{error}</p>}
                    
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

            <Card className="w-full">
                <CardHeader>
                     <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                        <Camera className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className={cn("text-3xl font-bold mt-4 text-center", isSimplified && 'text-4xl')}>Photo Mood Analysis</CardTitle>
                    <CardDescription className={cn("text-lg text-muted-foreground text-center", isSimplified && 'text-xl')}>
                        Take a photo to get an instant mood analysis and supportive suggestions.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="border rounded-lg p-4 bg-muted/50">
                        <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline/>
                        <canvas ref={canvasRef} className="hidden" />
                        {hasCameraPermission === false && (
                            <Alert variant="destructive">
                                <AlertTitle>Camera Access Required</AlertTitle>
                                <AlertDescription>
                                Please allow camera access to use this feature. You may need to grant permissions in your browser settings.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                    <Button onClick={handleTakePhotoAndAnalyze} disabled={isPhotoLoading || hasCameraPermission !== true} size="lg" className={cn("w-full", isSimplified && 'h-14 text-lg')}>
                        {isPhotoLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Analyzing Photo...
                            </>
                        ) : (
                            <>
                                <Camera className="mr-2 h-5 w-5" />
                                Analyze Photo
                            </>
                        )}
                    </Button>
                    
                    {photoError && <p className="text-destructive text-center">{photoError}</p>}

                    {photoAnalysis && (
                        <Card className="text-left bg-background">
                            <CardContent className="pt-6 grid gap-4">
                                <div>
                                    <h3 className="font-bold text-lg">Detected Mood:</h3>
                                    <p className="capitalize">{photoAnalysis.mood}</p>
                                </div>
                                 <div>
                                    <h3 className="font-bold text-lg">Analysis:</h3>
                                    <p className="whitespace-pre-wrap">{photoAnalysis.analysis}</p>
                                </div>
                                 <div>
                                    <h3 className="font-bold text-lg">Suggestion:</h3>
                                    <p className="whitespace-pre-wrap">{photoAnalysis.solution}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
