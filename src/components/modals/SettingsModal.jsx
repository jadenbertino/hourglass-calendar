import { useAuthContext } from '../../hooks/useAuthContext';
import { useModalContext } from '../../hooks/useModalContext';
import { useSignOut } from '../../hooks/useSignOut';
import Modal from './Modal';

// styles
import './SettingsModal.css';

export default function SettingsModal() {
  const { closeModal } = useModalContext();
  const { signout } = useSignOut();
  const { user } = useAuthContext();

  return (
    <Modal className={'settings'}>
      <button className='btn modal-actions modal-icon' onClick={closeModal}>
        <i className='fa-solid fa-x'></i>
      </button>
      <h2>Settings</h2>
      <p>Welcome, {user.displayName}</p>
      <button className='btn signout' onClick={signout}>
        Sign Out
      </button>
    </Modal>
  );
}
