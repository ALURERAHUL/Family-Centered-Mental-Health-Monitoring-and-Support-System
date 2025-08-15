'use client';
import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import { familyMembers as initialFamilyMembers, type FamilyMember } from '@/lib/data';

type AppContextType = {
  isSimplified: boolean;
  setIsSimplified: (isSimplified: boolean) => void;
  familyMembers: FamilyMember[];
  setFamilyMembers: React.Dispatch<React.SetStateAction<FamilyMember[]>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isSimplified, setIsSimplified] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialFamilyMembers);

  return (
    <AppContext.Provider value={{ isSimplified, setIsSimplified, familyMembers, setFamilyMembers }}>
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
