import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/init';
import { useModalContext } from '../../hooks/useModalContext';
import Modal from './Modal';

// styles
import './ConfirmDeleteModal.css';

export default function ConfirmDeleteModal({ id }) {
  const { closeModal, setModalView } = useModalContext();

  async function deleteEvent() {
    const ref = doc(db, 'events', id);
    await deleteDoc(ref);
    closeModal();
  }

  return (
    <Modal className={'confirm-delete-modal'}>
      <h2>Are you sure you want to delete this event?</h2>
      <div className='btns-wrapper'>
        <button className='btn cancel-delete' onClick={() => setModalView('view-event')}>
          Cancel
        </button>
        <button className='btn confirm-delete' onClick={deleteEvent}>
          Confirm
        </button>
      </div>
    </Modal>
  );
}
