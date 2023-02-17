import { Modal } from './components'
import { useSignUp } from '../hooks/useSignUp'
import { useEffect, useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'

// styles
import './auth.css'

export default function SignUpModal({setModalActive}) {
  // form controls
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { user } = useAuthContext()
  const { signup, error } = useSignUp()

  function handleSubmit(e) {
    e.preventDefault()
    signup(displayName, email, password)
  }

  useEffect(() => {
    if (user) setModalActive('')
    
    if (error) console.log(error)
  }, [user, error])
  
  return (
    <Modal>
      <div className="auth-modal">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="first name"
            onChange={(e) => setDisplayName(e.target.value)}
            value={displayName}
          />
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
          <button className="btn">Sign Up</button>
        </form>
        <button type="button" className="close-modal-btn" onClick={() => setModalActive('')}>
          <i className="fa-solid fa-x"></i>
        </button>
      </div>
    </Modal>
  )
}