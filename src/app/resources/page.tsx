'use client';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Send, User, Bot } from 'lucide-react';
import { getWellnessCoachResponse } from '@/lib/actions';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/contexts/app-context';
import ReactMarkdown from 'react-markdown';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


type ChatMessage = {
    role: 'user' | 'model';
    content: string;
}

export default function ResourcesPage() {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isSimplified, familyMembers, moodEntries, calendarEvents } = useAppContext();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const newUserMessage: ChatMessage = { role: 'user', content: userInput };
        setChatHistory(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);
        setError(null);

        const result = await getWellnessCoachResponse([...chatHistory, newUserMessage], familyMembers, moodEntries, calendarEvents);
        
        if (result.error) {
            setError(result.error);
            const errorMessage: ChatMessage = { role: 'model', content: 'Sorry, I encountered an error. Please try again.'};
            setChatHistory(prev => [...prev, errorMessage]);
        } else {
            const modelResponse: ChatMessage = { role: 'model', content: result.response };
            setChatHistory(prev => [...prev, modelResponse]);
        }
        setIsLoading(false);
    }
    
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [chatHistory]);

    return (
        <div className="h-[calc(100vh-10rem)]">
            <Card className="h-full flex flex-col">
                 <CardHeader>
                    <div className="flex items-center gap-4">
                         <div className="mx-auto sm:mx-0 bg-primary/10 p-3 rounded-full w-fit">
                            <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className={cn("text-2xl font-bold", isSimplified && 'text-3xl')}>AI Wellness Coach</CardTitle>
                            <CardDescription className={cn("text-base", isSimplified && 'text-lg')}>
                                Chat with an AI to get personalized family wellness advice.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden">
                    <ScrollArea className="h-full px-4 sm:px-6" ref={scrollAreaRef}>
                        <div className="space-y-6 pb-6">
                            <div className="flex gap-3 items-start">
                                <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                                    <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
                                </Avatar>
                                <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-lg">
                                    <ReactMarkdown className="prose prose-zinc dark:prose-invert max-w-none">
                                        Hello! I'm your AI Family Wellness Coach. How can I help you and your family today?
                                    </ReactMarkdown>
                                </div>
                            </div>
                            {chatHistory.map((message, index) => (
                                <div key={index} className={cn("flex gap-3 items-start", message.role === 'user' && 'justify-end')}>
                                    {message.role === 'model' && (
                                        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                                            <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={cn(
                                        "p-3 rounded-lg max-w-lg", 
                                        message.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-tl-none'
                                        )}>
                                         <ReactMarkdown className="prose prose-zinc dark:prose-invert max-w-none prose-p:text-inherit">
                                            {message.content}
                                        </ReactMarkdown>
                                    </div>
                                     {message.role === 'user' && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                             {isLoading && (
                                <div className="flex gap-3 items-start">
                                    <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                                        <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
                                    </Avatar>
                                    <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-lg flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Thinking...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
                <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <Input 
                            value={userInput}
                            onChange={e => setUserInput(e.target.value)}
                            placeholder="Ask for advice or share what's on your mind..."
                            disabled={isLoading}
                            className={cn(isSimplified && 'h-12 text-lg')}
                        />
                        <Button type="submit" disabled={isLoading || !userInput.trim()} className={cn(isSimplified && 'h-12')}>
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
