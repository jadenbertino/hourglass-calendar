import { useContext } from "react";
import { DateContext } from "../context/DateContext";

export function useDateContext() {
  const context = useContext(DateContext)

  if (!context) {
    throw new Error('dateContext must be accessed within a dateContextProvider')
  }

  return context
}