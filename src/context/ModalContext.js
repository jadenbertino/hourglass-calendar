import { createContext, useState } from "react"

export const ModalContext = createContext()

export function ModalContextProvider({ children }) {

  const [modalContext, setModalContext] = useState({
    view: '',
    payload: ''
  })

  function closeModal() {
    setModalContext(prev => ({...prev, view: ''}))
  }

  function setModalView(view) {
    setModalContext(prev => ({...prev, view: view}))
  }

  return (
    <ModalContext.Provider value={{ modalContext, setModalContext, closeModal, setModalView }} >
      { children }
    </ModalContext.Provider>
  )
}