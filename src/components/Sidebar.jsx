import './Sidebar.css'

export default function Sidebar({setModalActive}) {
  return (
    <div className="container sidebar">
      <div className="row">
        <button className='btn new-event-btn' onClick={() => setModalActive('newEvent')}>New Event</button>
      </div>
    </div>
  )
}