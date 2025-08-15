'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAppContext } from '@/contexts/app-context';
import { familyMembers } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { isSimplified, setIsSimplified } = useAppContext();

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Settings</h1>
        <p className="text-muted-foreground">Manage your account and privacy settings.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Interface Settings</CardTitle>
          <CardDescription>Adjust the look and feel of the app.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="simplified-mode" className={cn("text-base", isSimplified && "text-lg font-semibold")}>
                Simplified Mode
              </Label>
              <p className={cn("text-sm text-muted-foreground", isSimplified && "text-base")}>
                Enlarge text and simplify the interface for easier use.
              </p>
            </div>
            <Switch
              id="simplified-mode"
              checked={isSimplified}
              onCheckedChange={setIsSimplified}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy Controls</CardTitle>
          <CardDescription>Choose what information to share with your family members.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {familyMembers.filter(m => m.id !== '1').map((member) => (
            <div key={member.id}>
                <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                        <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.name === 'Alex' ? 'man portrait' : member.name === 'Mia' ? 'girl portrait' : 'boy portrait'} />
                        <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold">Sharing with {member.name}</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                        <Label htmlFor={`mood-sharing-${member.id}`} className="flex items-center gap-2 text-base">
                            <Eye className="h-4 w-4" /> My Mood Entries
                        </Label>
                        <Switch id={`mood-sharing-${member.id}`} defaultChecked />
                    </div>
                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                        <Label htmlFor={`calendar-sharing-${member.id}`} className="flex items-center gap-2 text-base">
                            <Eye className="h-4 w-4" /> My Calendar Events
                        </Label>
                        <Switch id={`calendar-sharing-${member.id}`} defaultChecked />
                    </div>
                </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
