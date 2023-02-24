import { createContext, useState, useEffect } from 'react';

export const DateContext = createContext();

export function DateContextProvider({ children }) {
  const [dateContext, setDateContext] = useState(new Date());

  // date formatting
  const [dayName, setDayName] = useState('')
  const [dayOfMonth, setDayOfMonth] = useState('')
  const [formattedDate, setFormattedDate] = useState('')
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Re-format anytime date changes
  useEffect(() => {
    setDayName(days[dateContext.getDay()])
    setDayOfMonth(dateContext.getDate())
    setFormattedDate(formatDate(dateContext))
  }, [dateContext])

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

  function isMeridian(time) {
    const meridianRegex = /^(1[0-2]|0?[1-9])(:[0-5][0-9])?\s?[AP]M$/i;
    return meridianRegex.test(time)
  }

  function isMilitary(time) {
    const militaryRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return militaryRegex.test(time)
  }

  return (
    <DateContext.Provider value={{ dateContext, dayName, dayOfMonth, formattedDate, isMeridian, isMilitary, setDateContext, formatDate, incrementDateBy, decrementDateBy }}>
      {children}
    </DateContext.Provider>
  );
}
