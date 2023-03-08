import { useDateContext } from '../../hooks/useDateContext';
import DisplayWeeklyEvents from './DisplayWeeklyEvents';

export default function WeeklyEvents({ weekDates }) {
  const { getShortDayName } = useDateContext();

  return (
    <div className="weekly-events">
      <div className="date-sidebar">
        {weekDates.map((date, i) => (
          <div className="date" key={i}>
            <h3 className="day-name">{getShortDayName(date)}</h3>
            <h2>{date.getDate()}</h2>
          </div>
        ))}
      </div>
      <DisplayWeeklyEvents />
    </div>
  );
}
