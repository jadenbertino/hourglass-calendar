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
    const militaryRegex = /^([01]\d|2[0-3]|\d):([0-5]\d)$/;
    return militaryRegex.test(time)
  }

  function parseTime(str) {
    /*
      str is in HH:MM:XM or HH:XM format,
      extracts { hours, minutes } from string
    */
    try {
      // remove whitespace
      str = str.replace(/\s/g, "");
      const hoursRegex = /^\d+(?=:|[a-zA-Z])/;
      let hours = Number(str.match(hoursRegex)[0]);
      const minutes = str.includes(":") ? Number(str.match(/:(.{2})/)[1]) : 0;
      
      // pm? => add 12 to hours
      if (hours !== 12 && str.toLowerCase().includes('pm')) {
        hours += 12
      }

      // hours is 12am? => subtract 12 hours
      if (hours === 12 && str.toLowerCase().includes('am')) {
        hours -= 12
      }

      // military time must be < 24:00
      if (hours >= 24) {
        throw new Error('Time cannot be past 24hrs')
      }

      return { hours, minutes }
    } catch {
      console.log('invalid time string')
    }
  }

  function convertToMilitary(time) {
    if (!isMeridian(time) && !isMilitary(time)) {
      console.log('string must be in meridian or military')
      return
    }
    
    const { hours, minutes } = parseTime(time)
    const hoursFormatted = hours.toString().padStart(2, "0")
    const minutesFormatted = minutes.toString().padStart(2, "0")
    return `${hoursFormatted}:${minutesFormatted}`
  }

  function convertToHours(time) {
    if (!isMeridian(time) && !isMilitary(time)) {
      console.log('string must be in meridian or military')
      return
    }

    const { hours, minutes } = parseTime(time)
    return hours + minutes / 60
  }

  return (
    <DateContext.Provider value={{ dateContext, dayName, dayOfMonth, formattedDate, convertToHours, convertToMilitary, parseTime, isMeridian, isMilitary, setDateContext, formatDate, incrementDateBy, decrementDateBy }}>
      {children}
    </DateContext.Provider>
  );
}
