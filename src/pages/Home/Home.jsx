import { useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'

// components
import { NewEventModal, Sidebar, Locked, SignInModal, SignUpModal, DailyView } from '../../components/components'

// styles
import './Home.css'

export default function Home() {
  const [modalActive, setModalActive] = useState('')
  const { user } = useAuthContext()

  return (
    <main>
      <div className="container">
        <div className="row">
          {user ? (
            <>
              <Sidebar setModalActive={setModalActive} />
              <DailyView />
              {modalActive === "newEvent" && <NewEventModal setModalActive={setModalActive}/> }
            </>
          ) : <Locked setModalActive={setModalActive} /> }
          {modalActive === 'signin' && <SignInModal setModalActive={setModalActive} />}
          {modalActive === 'signup' && <SignUpModal setModalActive={setModalActive} />}
        </div>
      </div>
    </main>
  )
}