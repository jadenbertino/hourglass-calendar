import { useDateContext } from '../../hooks/useDateContext';
import { useModalContext } from '../../hooks/useModalContext';
import Modal from './Modal';

export default function ViewEvent({ event }) {
  const { convertToMeridian, formatReadableDate } = useDateContext();
  const { setModalContext } = useModalContext();

  return (
    <>{event && 
      <Modal className={'view-event'}>
        <h2 className="name">{event.name}</h2>
        <p className="date">{formatReadableDate(event.date)}</p>
        <i className="dot">•</i>
        <p className="time">
          {convertToMeridian(event.startTime)} -{' '}
          {convertToMeridian(event.endTime)}
        </p>
        <p className="notes">{event.notes}</p>
        <div className="modal-actions">
          <button
            className="modal-icon delete-event"
            onClick={() => setModalContext('confirm-delete')}>
            <i className="fa-solid fa-trash"></i>
          </button>
          <button
            className="modal-icon edit-event"
            onClick={() => setModalContext('edit-event')}>
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
          <button
            className="modal-icon close-modal"
            onClick={() => setModalContext('')}>
            <i className="fa-solid fa-x"></i>
          </button>
        </div>
      </Modal>
    }</>
  );
}
