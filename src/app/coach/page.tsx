
'use client';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Loader2 } from 'lucide-react';
import { useAppContext } from '@/contexts/app-context';
import { cn } from '@/lib/utils';
import { getWellnessCoachResponse } from '@/lib/actions';
import ReactMarkdown from 'react-markdown';

type ChatMessage = {
    role: 'user' | 'model';
    content: string;
}

export default function CoachPage() {
    const { isSimplified, familyMembers, moodEntries, calendarEvents } = useAppContext();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() === '' || isLoading) return;

        const newMessages: ChatMessage[] = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        const result = await getWellnessCoachResponse(newMessages, familyMembers, moodEntries, calendarEvents);

        if (result.error) {
            setMessages([...newMessages, { role: 'model', content: `Sorry, something went wrong: ${result.error}` }]);
        } else if (result.response) {
            setMessages([...newMessages, { role: 'model', content: result.response }]);
        }
        setIsLoading(false);
    };

    return (
        <Card className="h-[calc(100vh-12rem)] flex flex-col">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Avatar className={cn('h-12 w-12', isSimplified && 'h-16 w-16')}>
                        <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className={cn('text-2xl font-bold', isSimplified && 'text-4xl')}>AI Wellness Coach</CardTitle>
                        <CardDescription className={cn(isSimplified && 'text-lg')}>Your personal guide to family well-being. Ask me anything.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full px-6" ref={scrollAreaRef}>
                    <div className="space-y-6">
                        {messages.length === 0 && (
                            <div className="text-center text-muted-foreground pt-10">
                                <p className={cn(isSimplified && 'text-lg')}>No messages yet. Start the conversation by asking a question below.</p>
                                <p className={cn('mt-2 text-sm', isSimplified && 'text-base')}>Examples: "How can I help my daughter with exam stress?" or "Suggest a fun family activity for a rainy day."</p>
                            </div>
                        )}
                        {messages.map((message, index) => (
                            <div key={index} className={cn("flex items-start gap-4", message.role === 'user' ? 'justify-end' : '')}>
                                {message.role === 'model' && (
                                    <Avatar className={cn('h-10 w-10 bg-primary text-primary-foreground flex-shrink-0', isSimplified && 'h-12 w-12')}>
                                        <AvatarFallback><Bot /></AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn("rounded-lg px-4 py-3 max-w-lg", 
                                    message.role === 'model' ? 'bg-muted' : 'bg-primary text-primary-foreground'
                                )}>
                                    <ReactMarkdown className={cn("prose prose-zinc dark:prose-invert max-w-none", isSimplified && 'prose-lg', message.role === 'user' && 'dark:prose-invert-user-message')}>
                                       {message.content}
                                    </ReactMarkdown>
                                </div>
                                {message.role === 'user' && (
                                     <Avatar className={cn('h-10 w-10 flex-shrink-0', isSimplified && 'h-12 w-12')}>
                                        <AvatarImage src={familyMembers.find(m => m.id === '1')?.avatar} />
                                        <AvatarFallback><User /></AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-start gap-4">
                                <Avatar className={cn('h-10 w-10 bg-primary text-primary-foreground flex-shrink-0', isSimplified && 'h-12 w-12')}>
                                    <AvatarFallback><Bot /></AvatarFallback>
                                </Avatar>
                                <div className="rounded-lg px-4 py-3 max-w-lg bg-muted flex items-center">
                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="pt-4 border-t">
                <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                    <Input
                        type="text"
                        placeholder="Ask for advice or support..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        className={cn(isSimplified && 'h-12 text-lg')}
                    />
                    <Button type="submit" disabled={isLoading || input.trim() === ''} className={cn(isSimplified && 'h-12 text-lg')}>
                        {isLoading ? (
                            <Loader2 className={cn('h-4 w-4 animate-spin', isSimplified && 'h-5 w-5')} />
                        ) : (
                            <Send className={cn('h-4 w-4', isSimplified && 'h-5 w-5')} />
                        )}
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}

