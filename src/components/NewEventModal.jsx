import { useState } from 'react'

// components
import { Modal } from './components'

// styles
import styles from './NewEventModal.module.css'

export default function () {
  // form controls
  return (
    <Modal>
      <form className={styles['new-event-form']}>
        <input
          className={styles.name}
          type="text"
          placeholder='Event Name' 
        />
        <input
          className={styles.date}
          type="date"
          placeholder = 'Date'
        />
        <div className={styles['time-wrapper']}>
          <input
            className={styles['start-time']}
            type="text"
            placeholder='Start Time'
          />
          <input
            className={styles['end-time']}
            type="text"
            placeholder='End Time'
          />
        </div>
        <textarea
          className={styles.notes}
          placeholder='Event Notes'
        />
        <button className={`btn ${styles['cancel-btn']}`}>Cancel</button>
        <button className={`btn ${styles['save-btn']}`}>Save</button>
      </form>
    </Modal>
  )
}