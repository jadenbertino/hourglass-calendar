const FULL_DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const SHORT_DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

/*
    Get details abt a given date
*/

export function getShortDayName(date) {
  return SHORT_DAY_NAMES[date.getDay()];
}

export function getMonthName(date) {
  return MONTH_NAMES[date.getMonth()];
}

export function getDayOfMonth(date) {
  return date.getDate();
}

export function getYear(date) {
  return date.getFullYear();
}

export function getDayOfWeek(date) {
  return FULL_DAY_NAMES[date.getDay()];
}

export function checkIfIsToday(date) {
  const todaysDate = new Date();
  return todaysDate.toDateString() === date.toDateString();
}

export function isMeridian(time) {
  // HH:MM XM OR HH XM
  const meridianRegex = /^(1[0-2]|0?[1-9])(:[0-5][0-9])?\s?[AP]M$/i;
  return meridianRegex.test(time);
}

export function isMilitary(time) {
  // HH:MM
  const militaryRegex = /^([01]\d|2[0-3]|\d):([0-5]\d)$/;
  return militaryRegex.test(time);
}

export function parseTime(str) {
  // extracts { hours, minutes } from string in format that passes isMeridian or isMilitary
  try {
    str = str.replace(/\s/g, ''); // remove whitespace
    let hours = Number(str.match(/^\d+(?=:|[a-zA-Z])/)[0]);
    const minutes = str.includes(':') ? Number(str.match(/:(.{2})/)[1]) : 0;

    // pm? => add 12 to hours
    if (hours !== 12 && str.toLowerCase().includes('pm')) {
      hours += 12;
    }

    // hours is 12am? => subtract 12 hours
    if (hours === 12 && str.toLowerCase().includes('am')) {
      hours -= 12;
    }

    // military time must be < 24:00
    if (hours >= 24) {
      throw new Error('Time cannot be past 24hrs');
    }

    return { hours, minutes };
  } catch {
    console.log('invalid time string');
  }
}

/*
    format a given date
*/

export function formatDate(date) {
  // date object => YYYY-MM-DD
  try {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  } catch {}
}

export function formatReadableDate(str) {
  // Fri, February 24
  try {
    const date = parseDate(str);
    const dayName = FULL_DAY_NAMES[date.getDay()];
    const dayNumber = date.getDate();
    const monthName = MONTH_NAMES[date.getMonth()];
    return `${dayName}, ${monthName} ${dayNumber}`;
  } catch {}
}

export function convertToMinutes(militaryTimeStr) {
  // converts HH:MM time to integer of minutes since midnight

  if (!isMilitary(militaryTimeStr)) {
    console.log('string must be in meridian or military');
    return;
  }

  const [hours, minutes] = militaryTimeStr.split(':');
  return parseInt(hours) * 60 + parseInt(minutes);
}

export function convertToMilitary(time) {
  if (!isMeridian(time) && !isMilitary(time)) {
    console.log('string must be in meridian or military');
    return;
  }

  const { hours, minutes } = parseTime(time);
  const hoursFormatted = hours.toString().padStart(2, '0');
  const minutesFormatted = minutes.toString().padStart(2, '0');
  return `${hoursFormatted}:${minutesFormatted}`;
}

export function convertToMeridian(time) {
  if (!isMeridian(time) && !isMilitary(time)) {
    console.log('string must be in meridian or military');
    return;
  }

  if (isMeridian(time)) return time;

  // is in military time
  const { hours, minutes } = parseTime(time);
  const hoursFormatted = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const minutesFormatted =
    minutes === 0 ? '' : minutes.toString().padStart(2, '0');
  const meridian = hours < 12 ? 'am' : 'pm';
  return `${hoursFormatted}${
    minutesFormatted === '' ? '' : ':'
  }${minutesFormatted}${meridian}`;
}

export function convertToHours(time) {
  if (!isMeridian(time) && !isMilitary(time)) {
    console.log('string must be in meridian or military');
    return;
  }

  const { hours, minutes } = parseTime(time);
  return hours + minutes / 60;
}

export function parseDate(str) {
  // assumes YYYY-MM-DD format
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(str)) return;
  const [year, month, day] = str.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date;
}

export function getWeek(startDate) {
  let week = [];
  for (let i = 0; i < 7; i++) {
    let newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + i);
    week.push(newDate);
  }
  return week;
}

export function getMonth(startDate) {
  let month = [];
  for (let i = 0; i < 35; i++) {
    let newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + i);
    month.push(newDate);
  }
  return month;
}

export function getStartOfWeek(date) {
  const newDate = new Date(date.getTime()); // create a new Date object with the same time value as the original
  while (newDate.getDay() !== 1) {
    // while the day is not Monday (1)
    newDate.setDate(newDate.getDate() - 1); // decrement the date by 1 day
  }
  return newDate;
}

export function getStartOfMonth(date) {
  const newDate = new Date(date.getTime()); // create a new Date object with the same time value as the original
  while (newDate.getDate() !== 1) {
    // while the day of the month is not 1
    newDate.setDate(newDate.getDate() - 1); // decrement the date by 1 day
  }
  return newDate;
}

export function getEvents(date, events) {
  const formattedDate = formatDate(date);
  return events
    .filter(event => event.date === formattedDate)
    .sort(
      (eventA, eventB) =>
        convertToHours(eventA.startTime) - convertToHours(eventB.startTime)
    );
}
