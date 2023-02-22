import { createContext, useState } from 'react';

export const DateContext = createContext();

export function DateContextProvider({ children }) {
  const [dateContext, setDateContext] = useState(new Date());

  return (
    <DateContext.Provider value={{ dateContext, setDateContext }}>
      {children}
    </DateContext.Provider>
  );
}
