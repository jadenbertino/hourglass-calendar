import './HoursList.css';

export default function HoursList() {
  const hours = new Array(24).fill(null);

  return (
    <div className="hours">
      {hours.map((_, i) => {
        const hourName = i % 12 === 0 ? 12 : i % 12;
        const meridian = i < 12 ? 'am' : 'pm';
        return (
          <div className="hour-wrapper" key={i}>
            <span className="hour">{hourName}{meridian}</span>
            <div className="border-provider"></div>
          </div>
        );
      })}
    </div>
  );
}
