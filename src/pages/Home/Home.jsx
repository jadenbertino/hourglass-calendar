import { useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useModalContext } from '../../hooks/useModalContext'

// components
import { NewEventModal, Sidebar, Locked, SignInModal, SignUpModal, DailyView } from '../../components/components'

// styles
import './Home.css'

export default function Home() {
  const { user } = useAuthContext()
  const { modalContext, setModalContext } = useModalContext()

  return (
    <main>
      <div className="container">
        <div className="row">
          {user ? (
            <>
              <Sidebar/>
              <DailyView />
              {modalContext === "newEvent" && <NewEventModal/> }
            </>
          ) : <Locked/> }
          {modalContext === 'signin' && <SignInModal/>}
          {modalContext === 'signup' && <SignUpModal/>}
        </div>
      </div>
    </main>
  )
}