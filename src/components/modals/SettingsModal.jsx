import { useModalContext } from '../../hooks/useModalContext';
import Modal from './Modal';
import { useSignOut } from '../../hooks/useSignOut';

export default function SettingsModal() {
  const { setModalContext } = useModalContext();
  const { signout } = useSignOut()

  return (
    <Modal className={'settings'}>
      <button className="btn modal-actions modal-icon" onClick={() => setModalContext('')}>
        <i className="fa-solid fa-x"></i>
      </button>
      <h2>Settings</h2>
      <button className="btn" onClick={signout}>Sign Out</button>
    </Modal>
  );
}
