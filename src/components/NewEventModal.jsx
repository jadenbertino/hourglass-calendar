import { useState } from 'react'

// components
import { Modal } from './components'

// styles
import './NewEventModal.css'

export default function () {
  // form controls
  return (
    <Modal>
      <form className='new-event-form'>
        <input
          className='name'
          type="text"
          placeholder='Event Name' 
        />
        <input
          className='date'
          type="date"
          placeholder = 'Date'
        />
        <div className='time-wrapper'>
          <input
            className='start-time'
            type="text"
            placeholder='Start Time'
          />
          <input
            className='end-time'
            type="text"
            placeholder='End Time'
          />
        </div>
        <textarea
          className='notes'
          placeholder='Event Notes'
        />
        <button className='btn cancel-btn'>Cancel</button>
        <button className='btn save-btn'>Save</button>
      </form>
    </Modal>
  )
}