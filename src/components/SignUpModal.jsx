import { Modal } from './components'
import { useSignUp } from '../hooks/useSignUp'
import { useEffect, useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'

// styles
import './auth.css'

export default function SignUpModal({setModalActive}) {
  // form controls & alidation
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validDisplayName, setValidDisplayName] = useState(true)
  const [validEmail, setValidEmail] = useState(true)
  const [validPassword, setValidPassword] = useState(true)

  const { user } = useAuthContext()
  const { signup, error } = useSignUp()

  function handleSubmit(e) {
    e.preventDefault()
    setValidDisplayName(true)

    if (displayName.length > 0) {
      signup(displayName, email, password)
    } else {
      setValidDisplayName(false)
    }
  }

  useEffect(() => {
    if (user) setModalActive('') // close sign in modal on signup
    
    if (error) {
      if (error.includes("email")) {
        alert('Email already in use')
        setValidEmail(false)
      } 
      setValidPassword(!error.includes("password"))
      setValidDisplayName(displayName.length > 0)
    }
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
            className={validDisplayName ? "" : "invalid"}
            required
          />
          <input
            type="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className={validEmail ? "" : "invalid"}
            required
          />
          <input
            type="password"
            placeholder="password (6 characters or more)"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className={validPassword ? "" : "invalid"}
            required
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