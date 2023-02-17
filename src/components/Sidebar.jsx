import './Sidebar.css'

export default function Sidebar({setModalActive}) {
  return (
    <div className="container sidebar">
      <p>sidebar</p>
      <button className='btn new-event-btn' onClick={() => setModalActive('newEvent')}>New Event</button>
    </div>
  )
}