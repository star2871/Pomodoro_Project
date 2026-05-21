import React, { createContext, useContext, useState } from 'react';

const FocusContext = createContext();

export function FocusProvider({ children }) {
  // Currently, we leave it lightweight and open for global preferences
  // that don't need persistent storage sync, or to hold instances like audioSynth
  const [globalTheme, setGlobalTheme] = useState('light');

  return (
    <FocusContext.Provider value={{ globalTheme, setGlobalTheme }}>
      {children}
    </FocusContext.Provider>
  );
}

export function useFocusContext() {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error('useFocusContext must be used within a FocusProvider');
  }
  return context;
}
