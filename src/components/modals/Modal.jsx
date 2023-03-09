import { createPortal } from 'react-dom'

// styles
import './Modal.css'

export default function Modal({ children, className }) {
  const root = document.querySelector('#root')
  console.log(className)
  return createPortal((
    <div className="modal-backdrop">
      <div className={`modal ${className ? className : ''}`}>
        {children}
      </div>
    </div>
  ), root)
}