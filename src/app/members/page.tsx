
'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { FamilyMember } from '@/lib/data';
import { User, Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAppContext } from '@/contexts/app-context';
import { cn } from '@/lib/utils';

export default function MembersPage() {
  const { familyMembers, setFamilyMembers, isSimplified } = useAppContext();
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelationship, setNewMemberRelationship] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddMember = () => {
    if (newMemberName.trim() === '' || newMemberRelationship.trim() === '') return;
    const newMember: FamilyMember = {
      id: `m${familyMembers.length + 1}`,
      name: newMemberName,
      relationship: newMemberRelationship,
      avatar: 'https://placehold.co/40x40.png',
    };
    setFamilyMembers([...familyMembers, newMember]);
    setNewMemberName('');
    setNewMemberRelationship('');
    setIsDialogOpen(false);
  };

  const handleDeleteMember = (id: string) => {
    setFamilyMembers(familyMembers.filter((member) => member.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn('text-3xl font-bold font-headline', isSimplified && 'text-4xl')}>Family Members</h1>
          <p className={cn('text-muted-foreground', isSimplified && 'text-lg')}>Manage your family members and their profiles.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className={cn(isSimplified && 'h-12 text-lg')}>
              <Plus className="mr-2 h-4 w-4" /> Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className={cn(isSimplified && 'text-2xl')}>Add New Family Member</DialogTitle>
              <DialogDescription>
                Enter the details for the new family member and click save.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g. Grandma"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="relationship" className="text-right">
                  Relationship
                </Label>
                <Input
                  id="relationship"
                  value={newMemberRelationship}
                  onChange={(e) => setNewMemberRelationship(e.target.value)}
                  className="col-span-3"
                   placeholder="e.g. Grandmother"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddMember} className={cn(isSimplified && 'h-12 text-lg')}>Save Member</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <ul className="divide-y">
            {familyMembers.map((member) => (
              <li key={member.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <Avatar className={cn('h-12 w-12', isSimplified && 'h-16 w-16')}>
                    <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.name === 'You' ? 'woman portrait' : member.name === 'Alex' ? 'man portrait' : member.name === 'Mia' ? 'girl portrait' : 'boy portrait'} />
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                  <div>
                    <p className={cn('font-bold text-lg', isSimplified && 'text-2xl')}>{member.name}</p>
                    <p className={cn('text-muted-foreground', isSimplified && 'text-lg')}>{member.relationship}</p>
                  </div>
                </div>
                {member.id !== '1' && ( // Prevent deleting "You"
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteMember(member.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
