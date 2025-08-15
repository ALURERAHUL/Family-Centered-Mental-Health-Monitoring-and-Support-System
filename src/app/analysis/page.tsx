'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, User, Camera, Upload, History, MessageCircle } from 'lucide-react';
import { getFamilyPatternAnalysis, getPhotoMoodAnalysis, getCommunicationPatternAnalysis } from '@/lib/actions';
import { useAppContext } from '@/contexts/app-context';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import type { AnalyzePhotoMoodOutput } from '@/ai/flows/analyze-photo-mood';
import { MoodHistoryChart } from '@/components/analysis/mood-history-chart';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';

type PhotoAnalysisHistoryEntry = AnalyzePhotoMoodOutput & { image: string; memberId: string; };

export default function AnalysisPage() {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedMemberId, setSelectedMemberId] = useState<string>('all');

    const [photoAnalysis, setPhotoAnalysis] = useState<AnalyzePhotoMoodOutput | null>(null);
    const [photoAnalysisHistory, setPhotoAnalysisHistory] = useState<PhotoAnalysisHistoryEntry[]>([]);
    const [isPhotoLoading, setIsPhotoLoading] = useState(false);
    const [photoError, setPhotoError] = useState<string | null>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [selectedPhotoMemberId, setSelectedPhotoMemberId] = useState<string>('1');
    const [selectedHistoryMemberId, setSelectedHistoryMemberId] = useState<string>('all');

    const [commAnalysis, setCommAnalysis] = useState<string | null>(null);
    const [isCommLoading, setIsCommLoading] = useState(false);
    const [commError, setCommError] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { isSimplified, familyMembers, moodEntries, calendarEvents, forumPosts } = useAppContext();
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
            // Non-blocking, user can still upload a photo.
          }
        };
    
        getCameraPermission();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        }
      }, []);

    const handleAnalyze = async () => {
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        const result = await getFamilyPatternAnalysis(selectedMemberId, familyMembers, moodEntries, calendarEvents);
        if (result.error) {
            setError(result.error);
        } else if (result.summary) {
            setAnalysis(result.summary);
        }
        setIsLoading(false);
    };

    const handleAnalyzeCommunication = async () => {
        setIsCommLoading(true);
        setCommError(null);
        setCommAnalysis(null);
        const result = await getCommunicationPatternAnalysis(familyMembers, forumPosts);
        if (result.error) {
            setCommError(result.error);
        } else if (result.analysisSummary) {
            setCommAnalysis(result.analysisSummary);
        }
        setIsCommLoading(false);
    };
    
    const analyzePhoto = async (photoDataUri: string) => {
        setIsPhotoLoading(true);
        setPhotoError(null);
        setPhotoAnalysis(null);
        setUploadedImage(null);

        const result = await getPhotoMoodAnalysis(photoDataUri);

        if (result.error) {
            setPhotoError(result.error);
        } else {
            const newAnalysis: PhotoAnalysisHistoryEntry = { ...result, image: photoDataUri, memberId: selectedPhotoMemberId };
            setPhotoAnalysis(result);
            setPhotoAnalysisHistory(prev => [newAnalysis, ...prev]);
        }
        setIsPhotoLoading(false);
        setUploadedImage(photoDataUri);
    }

    const handleTakePhotoAndAnalyze = async () => {
        if (!videoRef.current || !canvasRef.current) return;
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const photoDataUri = canvas.toDataURL('image/jpeg');
            await analyzePhoto(photoDataUri);
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            processFile(file);
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
    }, []);
    
    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
    }, []);


    const processFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = async (loadEvent) => {
            const photoDataUri = loadEvent.target?.result as string;
            if(photoDataUri){
                await analyzePhoto(photoDataUri);
            }
        };
        reader.readAsDataURL(file);
    };

    const filteredHistory = photoAnalysisHistory.filter(entry => 
        selectedHistoryMemberId === 'all' || entry.memberId === selectedHistoryMemberId
    );
    const getMember = (id: string) => familyMembers.find(m => m.id === id);


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
                                    Mood & Event Analysis
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

            <Card>
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                        <MessageCircle className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className={cn("text-3xl font-bold mt-4 text-center", isSimplified && 'text-4xl')}>Communication Pattern Analysis</CardTitle>
                    <CardDescription className={cn("text-lg text-muted-foreground text-center", isSimplified && 'text-xl')}>
                        Analyze your family's forum conversations for patterns and insights.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex justify-center">
                        <Button onClick={handleAnalyzeCommunication} disabled={isCommLoading} size="lg" className={cn(isSimplified && 'h-14 text-lg')}>
                            {isCommLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Analyzing Forum...
                                </>
                            ) : (
                                'Analyze Communication'
                            )}
                        </Button>
                    </div>

                    {commError && <p className="text-destructive text-center">{commError}</p>}
                    
                    {commAnalysis && (
                        <Card className="text-left bg-background">
                            <CardHeader>
                                <CardTitle className={cn("flex items-center gap-2", isSimplified && 'text-2xl')}>
                                    <MessageCircle className="h-5 w-5 text-primary" />
                                    Communication Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className={cn("whitespace-pre-wrap", isSimplified && 'text-lg')}>{commAnalysis}</p>
                            </CardContent>
                        </Card>
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
                        Take or upload a photo to get an instant mood analysis and supportive suggestions.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <Label htmlFor="photo-member" className={cn(isSimplified && 'text-lg')}>Select member for analysis:</Label>
                        <Select value={selectedPhotoMemberId} onValueChange={setSelectedPhotoMemberId}>
                            <SelectTrigger id="photo-member" className={cn("w-full sm:w-[280px]", isSimplified && 'h-14 text-lg')}>
                                <SelectValue placeholder="Select a family member" />
                            </SelectTrigger>
                            <SelectContent>
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
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 items-start">
                        <div className="space-y-4">
                            <CardTitle className="text-xl text-center">Option 1: Use Camera</CardTitle>
                            <div className="border rounded-lg p-4 bg-muted/50">
                                <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline/>
                                <canvas ref={canvasRef} className="hidden" />
                                {hasCameraPermission === false && (
                                    <Alert variant="destructive" className="mt-4">
                                        <AlertTitle>Camera Access Denied</AlertTitle>
                                        <AlertDescription>
                                        Please allow camera access in your browser to use this feature.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                            <Button onClick={handleTakePhotoAndAnalyze} disabled={isPhotoLoading || hasCameraPermission !== true} size="lg" className={cn("w-full", isSimplified && 'h-14 text-lg')}>
                                <Camera className="mr-2 h-5 w-5" />
                                Take Photo & Analyze
                            </Button>
                        </div>
                         <div className="space-y-4">
                            <CardTitle className="text-xl text-center">Option 2: Upload Photo</CardTitle>
                             <div 
                                className={cn("border-2 border-dashed rounded-lg p-4 bg-muted/50 aspect-video flex flex-col justify-center items-center text-center cursor-pointer", isSimplified && 'py-10', dragOver && "border-primary bg-primary/10")}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                                {uploadedImage && !isPhotoLoading ? (
                                    <Image src={uploadedImage} alt="Uploaded preview" width={200} height={150} className="max-h-full w-auto rounded-md" />
                                ) : (
                                    <div className='space-y-2'>
                                        <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                                        <p className="text-muted-foreground">Drag & drop an image here, or click to select one</p>
                                    </div>
                                )}
                            </div>
                         </div>
                    </div>

                    {isPhotoLoading && (
                        <div className="flex justify-center items-center gap-2 text-primary">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            <p>Analyzing Photo...</p>
                        </div>
                    )}
                    
                    {photoError && <p className="text-destructive text-center">{photoError}</p>}

                    {photoAnalysis && !isPhotoLoading && (
                        <Card className="text-left bg-background">
                            <CardHeader>
                                <CardTitle>Latest Analysis for {getMember(selectedPhotoMemberId)?.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 grid gap-4">
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

            {photoAnalysisHistory.length > 0 && (
                <Card>
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                            <History className="h-10 w-10 text-primary" />
                        </div>
                        <CardTitle className={cn("text-3xl font-bold mt-4 text-center", isSimplified && 'text-4xl')}>Mood Analysis History</CardTitle>
                        <CardDescription className={cn("text-lg text-muted-foreground text-center", isSimplified && 'text-xl')}>
                            Review past analyses and compare mood trends over time.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                         <div className="space-y-4">
                            <Label htmlFor="history-member" className={cn(isSimplified && 'text-lg')}>Filter history by member:</Label>
                            <Select value={selectedHistoryMemberId} onValueChange={setSelectedHistoryMemberId}>
                                <SelectTrigger id="history-member" className={cn("w-full sm:w-[280px]", isSimplified && 'h-14 text-lg')}>
                                    <SelectValue placeholder="Select a family member" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Family Members</SelectItem>
                                    {familyMembers.map((member) => (
                                        <SelectItem key={member.id} value={member.id}>
                                        <div className="flex items-center gap-2">
                                                <Avatar className='h-6 w-6'>
                                                    <AvatarImage src={member.avatar} alt={member.name} />
                                                    <AvatarFallback><User /></AvatarFallback>
                                                </Avatar>
                                                <span>{member.name}</span>
                                        </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                           <h3 className="text-xl font-bold text-center mb-4">Mood Frequency</h3>
                           <MoodHistoryChart history={filteredHistory} />
                        </div>
                       
                        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                            {filteredHistory.length > 0 ? (
                                <div className="space-y-6">
                                {filteredHistory.map((entry, index) => {
                                    const member = getMember(entry.memberId);
                                    return (
                                        <Card key={index} className="flex flex-col md:flex-row gap-4 p-4">
                                            <Image src={entry.image} alt={`Analyzed photo ${index+1}`} width={150} height={150} className="rounded-md object-cover aspect-square" />
                                            <div className="flex-1">
                                                 <div>
                                                    <h3 className="font-bold text-lg">Analysis for: {member?.name}</h3>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg">Detected Mood:</h3>
                                                    <p className="capitalize">{entry.mood}</p>
                                                </div>
                                                <div className="mt-2">
                                                    <h3 className="font-bold text-lg">Analysis:</h3>
                                                    <p className="whitespace-pre-wrap text-sm">{entry.analysis}</p>
                                                </div>
                                                <div className="mt-2">
                                                    <h3 className="font-bold text-lg">Suggestion:</h3>
                                                    <p className="whitespace-pre-wrap text-sm">{entry.solution}</p>
                                                </div>
                                            </div>
                                        </Card>
                                    )
                                })}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-8">No history for this member.</p>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            )}

        </div>
    );
}
