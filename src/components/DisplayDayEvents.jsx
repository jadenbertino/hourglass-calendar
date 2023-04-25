import { useModalContext } from '../hooks/useModalContext';
import { convertToHours, convertToMeridian } from '../utils/DateUtils';

// styless
import './DisplayDayEvents.css';

const HOURS_PLACEHOLDERS = new Array(24).fill(null);

export default function DisplayEvents({ events }) {
  const { setModalContext } = useModalContext();

  return (
    <div className='calendar-column'>
      {HOURS_PLACEHOLDERS.map((_, i) => (
        <div className='divider' key={i}></div>
      ))}
      {events && events.map((event, i) => {
        const start = convertToHours(event.startTime);
        const end = convertToHours(event.endTime);
        let height = end - start;
        if (height < 0.5) height = 0.5; // min height of 0.5
        const width = (1 / event.overlap.length) * 100;
        const leftMargin = (event.order - 1) * width;
        const eventStyles = {
          top: `${start * 50}px`,
          height: `${height * 50}px`,
          width: `${width}%`,
          left: `${leftMargin}%`,
        };
        const size = end - start <= 1 ? 'small' : end - start <= 2 ? 'medium' : 'large';
        return (
          <div
            key={i}
            style={eventStyles}
            className={`event ${size}`}
            id={event.id}
            onClick={() => setModalContext({ view: 'view-event', payload: event.id })}
          >
            <h3 className='title'>{event.name}</h3>
            {size !== 'small' && (
              <>
                <p className='time'>
                  {convertToMeridian(event.startTime)} - {convertToMeridian(event.endTime)}
                </p>
                <p className='notes'>{event.notes}</p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
