import { convertToMeridian, formatReadableDate } from '../../utils/DateUtils'
import { useModalContext } from '../../hooks/useModalContext';
import Modal from './Modal';

export default function HiddenMonthlyEvents({ events }) {
  const { closeModal, setModalContext } = useModalContext();
  
  const date = formatReadableDate(events[0].date); // there will always be >= 1 events, logic is handled outside of this

  return (
    <Modal>
      <div className="day-of-month-modal">
        <h3>{date}</h3>
        {events.map((e, i) => (
          <div className="monthly-event" key={i} onClick={() => setModalContext({view: "view-event", payload: e.id})}>
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
