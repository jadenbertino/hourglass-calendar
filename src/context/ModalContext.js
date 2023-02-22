import { createContext, useState } from "react"

export const ModalContext = createContext()

export function ModalContextProvider({ children }) {

  const [modalContext, setModalContext] = useState('')

  return (
    <ModalContext.Provider value={{ modalContext, setModalContext }} >
      { children }
    </ModalContext.Provider>
  )
}