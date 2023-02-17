import { useState } from 'react'

// components
import { NewEventModal, Sidebar } from '../../components/components'

// styles
import './Home.css'

export default function Home() {
  const [modalActive, setModalActive] = useState('')

  return (
    <div>
      <Sidebar setModalActive={setModalActive} />
      {modalActive === "newEvent" && <NewEventModal setModalActive={setModalActive}/> }
    </div>
  )
}