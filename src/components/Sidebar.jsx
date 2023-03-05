import { useModalContext } from '../hooks/useModalContext'

// styles
import './Sidebar.css'

export default function Sidebar() {
  const { setModalContext } = useModalContext()
  
  return (
    <div className="container sidebar">
      <div className="row">

      </div>
    </div>
  )
}