export default function DisplayWeeklyEvents({ weekDates }) {
  return (
    <div className="events">
      {weekDates.map((date, i) => (
        <div className="weekday" key={i}>

        </div>
      ))}
    </div>
  )
}