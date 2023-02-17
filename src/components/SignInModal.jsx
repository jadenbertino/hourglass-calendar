import { Modal } from './components'
import { useState } from 'react'
import { useSignIn } from '../hooks/useSignIn'

// styles
import './auth.css'

export default function SignInModal({ setModalActive }) {
  // form controls
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const { signin } = useSignIn()

  function handleSubmit(e) {
    e.preventDefault()
    signin(email, password)
    setModalActive('')
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
        <button type="button" className="close-modal-btn" onClick={() => setModalActive('')}>
          <i className="fa-solid fa-x"></i>
        </button>
      </div>
    </Modal>
  )
}