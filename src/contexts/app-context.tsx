'use client';
import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import { familyMembers as initialFamilyMembers, moodEntries as initialMoodEntries, calendarEvents as initialCalendarEvents, type FamilyMember, type MoodEntry, type CalendarEvent } from '@/lib/data';

type AppContextType = {
  isSimplified: boolean;
  setIsSimplified: (isSimplified: boolean) => void;
  familyMembers: FamilyMember[];
  setFamilyMembers: React.Dispatch<React.SetStateAction<FamilyMember[]>>;
  moodEntries: MoodEntry[];
  setMoodEntries: React.Dispatch<React.SetStateAction<MoodEntry[]>>;
  calendarEvents: CalendarEvent[];
  setCalendarEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isSimplified, setIsSimplified] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialFamilyMembers);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(initialMoodEntries);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(initialCalendarEvents);


  return (
    <AppContext.Provider value={{ isSimplified, setIsSimplified, familyMembers, setFamilyMembers, moodEntries, setMoodEntries, calendarEvents, setCalendarEvents }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
