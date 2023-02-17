import { useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'

// components
import { NewEventModal, Sidebar } from '../../components/components'

// styles
import './Home.css'

export default function Home() {
  const [modalActive, setModalActive] = useState('')
  const { user } = useAuthContext()

  return (
    <div>
      {user ? (<>
        <Sidebar setModalActive={setModalActive} />
        {modalActive === "newEvent" && <NewEventModal setModalActive={setModalActive}/> }
      </>) : (<>
        <p className="container sidebar">please sign in</p>
      </>)}
    </div>
  )
}