import { useEffect, useState } from 'react'
import {useLogOut} from '../hooks/useLogOut'

import { SignInModal, SignUpModal } from './components'

import './Nav.css'

export default function Nav() {
  const [monthAndYear, setMonthAndYear] = useState('')
  const [modalActive, setModalActive] = useState('signup')
  const user = false;

  useEffect(() => {
    const today = new Date()
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = monthNames[today.getMonth()]
    const year = today.getFullYear()
    setMonthAndYear(`${month} ${year}`)
  }, [])

  return (
    <nav className="container row">
      <span>{monthAndYear}</span>
      <div className="auth">
        {!user ? (
          <>
            <button className="btn" onClick={() => setModalActive('signin')}>Sign In</button>
            <button className="btn" onClick={() => setModalActive('signup')}>Sign Up</button>
          </>
        ) : (
          <>
            <span>Welcome, {user.name}</span>
            <button className="btn" onClick={useLogOut}>Log Out</button>
          </>
        )}
      </div>
      {modalActive === 'signin' && <SignInModal setModalActive={setModalActive} />}
      {modalActive === 'signup' && <SignUpModal setModalActive={setModalActive} />}
    </nav>
  )
}