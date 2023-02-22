import { createPortal } from 'react-dom'

// styles
import './Modal.css'

export default function Modal({children}) {
  const root = document.querySelector('#root')

  return createPortal((
    <div className="modal-backdrop">
      <div className="modal">
        {children}
      </div>
    </div>
  ), root)
}