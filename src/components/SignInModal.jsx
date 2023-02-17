import { Modal } from './components'
import { useState } from 'react'

// styles
import './auth.css'

export default function SignInModal() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  
  function handleSubmit(e) {
    e.preventDefault()
  }

  return (
    <Modal>
      <div className="auth-modal">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button className="btn">Sign In</button>
        </form>
        <button type="button" className="close-modal-btn">
          <i className="fa-solid fa-x"></i>
        </button>
      </div>
    </Modal>
  )
}