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

  function incrementDateBy(num) {
    const newDate = new Date(dateContext)
    newDate.setDate(newDate.getDate() + num);
    setDateContext(newDate)
  }

  function decrementDateBy(num) {
    const newDate = new Date(dateContext)
    newDate.setDate(newDate.getDate() - num);
    setDateContext(newDate)
  }

  return (
    <DateContext.Provider value={{ dateContext, setDateContext, formatDate, incrementDateBy, decrementDateBy }}>
      {children}
    </DateContext.Provider>
  );
}
