import { Modal } from './components'
import { useEffect, useState } from 'react'
import { useSignIn } from '../hooks/useSignIn'
import { useAuthContext } from '../hooks/useAuthContext'
import { useModalContext } from '../hooks/useModalContext'

// styles
import './auth.css'

export default function SignInModal() {
  const { setModalContext } = useModalContext()

  // form controls & validation
  const [email, setEmail] = useState('')
  const [emailPlaceholder, setEmailPlaceholder] = useState('email')
  const [emailisValid, setEmailIsValid] = useState(true)
  
  const [password, setPassword] = useState('')
  const [passwordPlaceholder, setPasswordPlaceholder] = useState('password')
  const [passwordIsValid, setPasswordIsValid] = useState(true)

  const { user } = useAuthContext()
  const { signin, error } = useSignIn()

  async function handleSubmit(e) {
    e.preventDefault()
    await signin(email, password)
  }

  useEffect(() => {
    if (user) setModalContext('')
    if (error) {
      // reset
      setEmailIsValid(true)
      setPasswordIsValid(true)

      if (error.includes("user-not-found")) {
        setEmailIsValid(false)
        setEmail('')
        setEmailPlaceholder('email not found')
      }
      
      if (error.includes("wrong-password")) {
        setPasswordIsValid(false)
        setPassword('')
        setPasswordPlaceholder('wrong password')
      }
    }
  }, [user, error])

  return (
    <Modal>
      <div className="auth-modal">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder={emailPlaceholder}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className={emailisValid ? "" : "invalid"}
            required
            autoFocus
          />
          <input
            type="password"
            placeholder={passwordPlaceholder}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className={passwordIsValid ? "" : "invalid"}
            required
          />
          <button className="btn">Sign In</button>
        </form>
        <button type="button" className="close-modal-btn" onClick={() => setModalContext('')}>
          <i className="fa-solid fa-x"></i>
        </button>
      </div>
    </Modal>
  )
}