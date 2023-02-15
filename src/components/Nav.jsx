import { useEffect, useState } from 'react'

import './Nav.css'

export default function Nav() {
  const [monthAndYear, setMonthAndYear] = useState('')
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
            <button className="btn">Sign In</button>
            <button className="btn">Sign Up</button>
          </>
        ) : (
          <>
            <span>Welcome, {user.name}</span>
            <button className="btn">Log Out</button>
          </>
        )}
      </div>
    </nav>
  )
}