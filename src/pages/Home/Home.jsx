import { useState } from 'react'

// components
import { NewEventModal } from '../../components/components'

// styles
import './Home.css'

export default function Home() {
  const [modalActive, setModalActive] = useState('newEvent')
  return (
    <div>
      {modalActive === "newEvent" && <NewEventModal setModalActive={setModalActive}/> }
    </div>
  )
}