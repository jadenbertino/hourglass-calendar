import { createContext, useState } from 'react';

export const DateContext = createContext();

export function DateContextProvider({ children }) {
  const [dateContext, setDateContext] = useState(new Date());
  
  function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }

  return (
    <DateContext.Provider value={{ dateContext, setDateContext, formatDate }}>
      {children}
    </DateContext.Provider>
  );
}
