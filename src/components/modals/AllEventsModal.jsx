import { useDateContext } from '../../hooks/useDateContext';
import { useModalContext } from '../../hooks/useModalContext';
import Modal from './Modal';

export default function AllEventsModal({ events }) {
  const { convertToMeridian, formatReadableDate } = useDateContext();
  const { closeModal } = useModalContext();

  const date = formatReadableDate(events[0].date);

  return (
    <Modal>
      <div className="day-of-month-modal">
        <h3>{date}</h3>
        {events.map((e, i) => (
          <div className="monthly-event" key={i}>
            <div className="color-dot"></div>
            <span className="time">{convertToMeridian(e.startTime)}</span>
            <span className="name">{e.name}</span>
          </div>
        ))}
        <button
          className="modal-icon close-modal day-of-month"
          onClick={closeModal}>
          <i className="fa-solid fa-x"></i>
        </button>
      </div>
    </Modal>
  );
}
