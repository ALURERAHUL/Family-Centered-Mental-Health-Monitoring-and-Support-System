'use client';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { forumPosts, familyMembers, ForumPost } from '@/lib/data';
import { User, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAppContext } from '@/contexts/app-context';
import { cn } from '@/lib/utils';

export default function ForumPage() {
    const [posts, setPosts] = useState<ForumPost[]>(forumPosts);
    const [newMessage, setNewMessage] = useState('');
    const { isSimplified } = useAppContext();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const getMember = (id: string) => familyMembers.find(m => m.id === id);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;
        const newPost = {
            id: `p${posts.length + 1}`,
            memberId: '1', // Assume the current user is 'You'
            content: newMessage,
            timestamp: new Date().toISOString(),
        };
        setPosts([...posts, newPost]);
        setNewMessage('');
    };

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [posts]);

    return (
        <Card className="h-[calc(100vh-12rem)] flex flex-col">
            <CardHeader>
                <CardTitle className={cn('text-2xl font-bold', isSimplified && 'text-4xl')}>Family Forum</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full px-6" ref={scrollAreaRef}>
                    <div className="space-y-6">
                        {posts.map(post => {
                            const member = getMember(post.memberId);
                            return (
                                <div key={post.id} className="flex items-start gap-4">
                                    <Avatar className={cn('h-10 w-10', isSimplified && 'h-12 w-12')}>
                                        <AvatarImage src={member?.avatar} alt={member?.name} data-ai-hint={member?.name === 'You' ? 'woman portrait' : member?.name === 'Alex' ? 'man portrait' : member?.name === 'Mia' ? 'girl portrait' : 'boy portrait'} />
                                        <AvatarFallback><User /></AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-baseline gap-2">
                                            <p className={cn('font-bold', isSimplified && 'text-xl')}>{member?.name}</p>
                                            <p className={cn('text-xs text-muted-foreground', isSimplified && 'text-sm')}>{formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}</p>
                                        </div>
                                        <p className={cn('mt-1 text-foreground/90', isSimplified && 'text-lg')}>{post.content}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="pt-4 border-t">
                <div className="flex w-full items-center space-x-2">
                    <Input
                        type="text"
                        placeholder="Type a supportive message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className={cn(isSimplified && 'h-12 text-lg')}
                    />
                    <Button onClick={handleSendMessage} className={cn(isSimplified && 'h-12 text-lg')}>
                        <Send className={cn('h-4 w-4 mr-2', isSimplified && 'h-5 w-5')} />
                        Send
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
