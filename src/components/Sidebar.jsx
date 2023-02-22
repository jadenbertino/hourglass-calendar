import { useModalContext } from '../hooks/useModalContext'

// styles
import './Sidebar.css'

export default function Sidebar() {
  const { setModalContext } = useModalContext()
  
  return (
    <div className="sidebar">
      <button className='btn new-event-btn' onClick={() => setModalContext('newEvent')}>New Event</button>
    </div>
  )
}