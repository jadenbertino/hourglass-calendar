import { createPortal } from 'react-dom'

// styles
import './Modal.css'

export default function Modal({ children, className }) {
  const root = document.querySelector('#root')
  return createPortal((
    <div className="modal-backdrop">
      <div className={`modal ${className ? className : ''}`}>
        {children}
      </div>
    </div>
  ), root)
}