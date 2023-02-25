import { useModalContext } from '../hooks/useModalContext'

// styles
import './Sidebar.css'

export default function Sidebar() {
  const { setModalContext } = useModalContext()
  
  return (
    <div className="container sidebar">
      <div className="row">
        <button className='btn new-event-btn' onClick={() => setModalContext('newEvent')}>
          <i className="fa-solid fa-plus"></i>
          New Event
        </button>
      </div>
    </div>
  )
}