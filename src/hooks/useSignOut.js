import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { auth } from "../firebase/init";
import { useAuthContext } from "./useAuthContext";

export function useSignOut() {
  const [error, setError] = useState(null)
  const [pending, setPending] = useState(false)
  const [mounted, setMounted] = useState(true)
  const { setAuthContext } = useAuthContext()
  const nav = useNavigate()

  async function signout() {
    setError(null)
    setPending(true)

    try {
      // sign out user
      await signOut(auth)
      setAuthContext((prev) => ({...prev, user: null}))

      // only do state updates if mounted
      if (mounted) {
        setError(null)
        setPending(false)
      }
      
      // navigate to login page upon signout
      nav('/')

    } catch (err) {
      // only do state updates if mounted
      if (mounted) {
        console.log(err.message)
        setError(err.message)
        setPending(false)
      }
    }
  }
  
  useEffect(() => {
    return () => setMounted(false)
  }, [])

  return { signout, error, pending }
}