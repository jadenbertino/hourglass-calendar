import { useModalContext } from '../../hooks/useModalContext';
import { convertToMeridian, formatReadableDate } from '../../utils/DateUtils';
import Modal from './Modal';

// styles
import './ViewEventModal.css';

export default function ViewEventModal({ event }) {
  const { setModalView, closeModal } = useModalContext();

  return (
    <Modal className={'view-event'}>
      <h2 className='name'>{event.name}</h2>
      <p className='date'>{formatReadableDate(event.date)}</p>
      <i className='dot'>•</i>
      <p className='time'>
        {`${convertToMeridian(event.startTime)} - ${convertToMeridian(event.endTime)}`}
      </p>
      <p className='notes'>{event.notes}</p>
      <div className='modal-actions'>
        <button className='modal-icon delete-event' onClick={() => setModalView('confirm-delete')}>
          <i className='fa-solid fa-trash'></i>
        </button>
        <button className='modal-icon edit-event' onClick={() => setModalView('edit-event')}>
          <i className='fa-solid fa-pen-to-square'></i>
        </button>
        <button className='modal-icon close-modal' onClick={closeModal}>
          <i className='fa-solid fa-x'></i>
        </button>
      </div>
    </Modal>
  );
}
