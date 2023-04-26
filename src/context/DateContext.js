import { createContext, useState } from 'react';

/**
 * Date context object.
 *
 * @typedef {Object} DateContextObject
 * @property {Date} dateContext - The current date in the date context.
 * @property {Function} setDateContext - Function to set the current date in the date context.
 * @property {Function} incrementDateBy - Function to increment the date by a specified number of days.
 * @property {Function} decrementDateBy - Function to decrement the date by a specified number of days.
 * @property {Function} incrementMonth - Function to increment the date to the first day of the next month.
 * @property {Function} decrementMonth - Function to decrement the date to the first day of the previous month.
 * @property {Function} resetDateToToday - Function to reset the date in the date context to today's date.
 */
export const DateContext = createContext();

export function DateContextProvider({ children }) {
  const [dateContext, setDateContext] = useState(new Date());

  /**
   * Increment the date by a specified number of days.
   *
   * @param {number} num - The number of days to increment the date by.
   */
  function incrementDateBy(num) {
    const newDate = new Date(dateContext);
    newDate.setDate(newDate.getDate() + num);
    setDateContext(newDate);
  }

  /**
   * Decrement the date by a specified number of days.
   *
   * @param {number} num - The number of days to decrement the date by.
   */
  function decrementDateBy(num) {
    const newDate = new Date(dateContext);
    newDate.setDate(newDate.getDate() - num);
    setDateContext(newDate);
  }

  /**
   * Increment the date to the first day of the next month.
   */
  function incrementMonth() {
    const year =
      dateContext.getMonth() === 11
        ? dateContext.getFullYear() + 1
        : dateContext.getFullYear(); // increment year if current month is december
    const month = (dateContext.getMonth() + 1) % 12; // % 12 handles december
    const firstDayOfNextMonth = new Date(year, month, 1);
    setDateContext(firstDayOfNextMonth);
  }

  /**
   * Decrement the date to the first day of the previous month.
   */
  function decrementMonth() {
    const year =
      dateContext.getMonth() === 0
        ? dateContext.getFullYear() - 1
        : dateContext.getFullYear();
    const month =
      dateContext.getMonth() === 0 ? 11 : dateContext.getMonth() - 1;
    const firstDayOfPrevMonth = new Date(year, month, 1);
    setDateContext(firstDayOfPrevMonth);
  }

  /**
   * Reset the date in the date context to today's date.
   */
  function resetDateToToday() {
    const today = new Date();
    setDateContext(today);
  }

  return (
    <DateContext.Provider
      value={{
        dateContext,
        setDateContext,
        incrementDateBy,
        decrementDateBy,
        incrementMonth,
        decrementMonth,
        resetDateToToday
      }}>
      {children}
    </DateContext.Provider>
  );
}
