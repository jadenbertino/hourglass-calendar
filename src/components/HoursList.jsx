import './HoursList.css';

const HOURS_PLACEHOLDERS = new Array(24).fill(null);

export default function HoursList() {

  return (
    <div className='hours'>
      {HOURS_PLACEHOLDERS.map((_, i) => {
        const hourName = i % 12 === 0 ? 12 : i % 12;
        const meridian = i < 12 ? 'am' : 'pm';
        return (
          <div className='hour-wrapper' key={i}>
            <span className='hour'>{i !== 0 ? hourName + meridian : null}</span>
            <div className='border-provider'></div>
          </div>
        );
      })}
    </div>
  );
}
