export default function DisplayWeeklyEvents({ weekDates }) {
  return (
    <div className="events">
      {weekDates.map(date => (
        <div className="weekday"></div>
      ))}
    </div>
  )
}