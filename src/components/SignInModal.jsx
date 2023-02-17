import { Modal } from './components'
import { useEffect, useState } from 'react'
import { useSignIn } from '../hooks/useSignIn'
import { useAuthContext } from '../hooks/useAuthContext'

// styles
import './auth.css'

export default function SignInModal({ setModalActive }) {
  // form controls
  const [email, setEmail] = useState('')
  const [emailisValid, setEmailIsValid] = useState(true)
  const [password, setPassword] = useState('')
  const [passwordIsValid, setPasswordIsValid] = useState(true)

  const { user } = useAuthContext()
  const { signin, error } = useSignIn()

  async function handleSubmit(e) {
    e.preventDefault()
    await signin(email, password)
  }

  useEffect(() => {
    if (user) {
      setModalActive('')
      setEmailIsValid(true)
      setPasswordIsValid(true)
    }
    if (error) {
      setEmailIsValid(!error.includes("user-not-found"))
      setPasswordIsValid(!error.includes("wrong-password"))
    }
  }, [user, error])

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
            className={emailisValid ? "" : "invalid"}
          />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className={passwordIsValid ? "" : "invalid"}
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