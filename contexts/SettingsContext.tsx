import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Settings, SettingsContextType } from '../types';

const getInitialSettings = (): Settings => {
  try {
    const item = window.localStorage.getItem('clearSkiesSettings');
    const savedSettings = item ? JSON.parse(item) : {};
    return {
      theme: savedSettings.theme || 'light',
      tempUnit: savedSettings.tempUnit || 'C',
    };
  } catch (error) {
    console.warn('Error reading settings from localStorage', error);
    return {
      theme: 'light',
      tempUnit: 'C',
    };
  }
};

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(getInitialSettings);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(settings.theme);

    try {
      window.localStorage.setItem('clearSkiesSettings', JSON.stringify(settings));
    } catch (error) {
      console.warn('Error saving settings to localStorage', error);
    }
  }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};