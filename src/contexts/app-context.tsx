'use client';
import { type ReactNode, createContext, useContext, useState } from 'react';

type AppContextType = {
  isSimplified: boolean;
  setIsSimplified: (isSimplified: boolean) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isSimplified, setIsSimplified] = useState(false);

  return (
    <AppContext.Provider value={{ isSimplified, setIsSimplified }}>
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
