import './HoursGrid.css'

export default function HoursGrid() {
  const hours = new Array(24).fill(null)
  
  return (
    <div className="hours">
      {hours.map((_, i) => {
        const hourName = i % 12 === 0 ? 12 : i % 12;
        const meridian = i < 12 ? 'am' : 'pm';
        return <div key={i}>{hourName}{meridian}</div>
      })}
  </div>
  )
}