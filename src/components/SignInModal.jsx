import { Modal } from './components'

// styles
import './auth.css'

export default function SignInModal() {
  
  function handleSubmit(e) {
    e.preventDefault()
  }
  
  return (
    <Modal>
      <div className="auth-modal">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <button className="btn">Sign In</button>
        </form>
        <button type="button" className="close-modal-btn">
          <i className="fa-solid fa-x"></i>
        </button>
      </div>
    </Modal>
  )
}