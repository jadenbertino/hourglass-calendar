import { createContext, useState, useEffect } from 'react';

export const DateContext = createContext();

export function DateContextProvider({ children }) {
  const [dateContext, setDateContext] = useState(new Date());
  
  const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  
  function getShortDayName(date) {
    return shortDayNames[date.getDay()]
  }

  function getMonthName(date) {
    return monthNames[date.getMonth()]
  }

  function getDayOfMonth(date) {
    return date.getDate()
  }

  function getYear(date) {
    return date.getFullYear()
  }

  function getDayOfWeek(date) {
    return fullDayNames[date.getDay()]
  }
  
  function formatDate(date) {
    // date object => YYYY-MM-DD
    try {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate
    } catch { }
  }

  function checkIfIsToday(date) {
    const todaysDate = new Date()
    return todaysDate.toDateString() === date.toDateString()
  }

  function formatReadableDate(str) {
    // Fri, February 24
    try {
      const date = parseDate(str)
      const dayName = fullDayNames[date.getDay()]
      const dayNumber = date.getDate()
      const monthName = monthNames[date.getMonth()]
      return `${dayName}, ${monthName} ${dayNumber}`
    }
    catch {}
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

  function incrementMonth() {
    // Get the date 6 days from the input (top right)
    const endOfWeek = new Date(dateContext.getTime());
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    const currentMonth = endOfWeek.getMonth()
    
    const newDate = new Date(endOfWeek.getTime());
    while (newDate.getMonth() === currentMonth) {
      newDate.setDate(newDate.getDate() + 7)
    }
    
    newDate.setDate(newDate.getDate() - 6)
    setDateContext(newDate)
  }

  function decrementMonth() {
    // get current month
    const endOfWeek = new Date(dateContext.getTime());
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    const currentMonth = endOfWeek.getMonth();
  
    const newDate = new Date(endOfWeek.getTime());
    while (true) {
      // step back in 7 day increments
      newDate.setDate(newDate.getDate() - 7);
      const newMonth = newDate.getMonth();

      // once newDate is 2 months behind currentMonth, increment by 1 => puts you at start of previous month
      if ((newMonth + 2) % 12 === currentMonth) {
        newDate.setDate(newDate.getDate() + 1);
        setDateContext(newDate);
        return;
      }
    }
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

  function convertToMeridian(time) {
    if (!isMeridian(time) && !isMilitary(time)) {
      console.log('string must be in meridian or military')
      return
    }

    if (isMeridian(time)) return time

    // is in military time
    const { hours, minutes } = parseTime(time)
    const hoursFormatted = hours === 0 ? 12 :
      hours > 12 ? hours - 12 : hours
    const minutesFormatted = minutes === 0 ? "" : minutes.toString().padStart(2, "0")
    const meridian = hours < 12 ? 'am' : 'pm'
    return `${hoursFormatted}${minutesFormatted === "" ? "" : ":"}${minutesFormatted}${meridian}`
  }

  function convertToHours(time) {
    if (!isMeridian(time) && !isMilitary(time)) {
      console.log('string must be in meridian or military')
      return
    }

    const { hours, minutes } = parseTime(time)
    return hours + minutes / 60
  }

  function parseDate(str) {
    // assumes YYYY-MM-DD format
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(str)) return
    const [year, month, day] = str.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return date
  }

  function resetDateToToday() {
    const today = new Date()
    setDateContext(today)
  }

  function getWeek(startDate) {
    let week = [];
    for (let i = 0; i < 7; i++) {
      let newDate = new Date(startDate);
      newDate.setDate(startDate.getDate() + i);
      week.push(newDate);
    }
    return week
  }

  function getMonth(startDate) {
    let month = [];
    for (let i = 0; i < 35; i++) {
      let newDate = new Date(startDate);
      newDate.setDate(startDate.getDate() + i);
      month.push(newDate);
    }
    return month
  }

  return (
    <DateContext.Provider value={{ dateContext, checkIfIsToday, getDayOfMonth, getYear, getDayOfWeek, incrementMonth, decrementMonth, getMonth, getMonthName, getShortDayName, getWeek, resetDateToToday, formatReadableDate, convertToMeridian, parseDate ,convertToHours, convertToMilitary, parseTime, isMeridian, isMilitary, setDateContext, formatDate, incrementDateBy, decrementDateBy }}>
      {children}
    </DateContext.Provider>
  );
}
