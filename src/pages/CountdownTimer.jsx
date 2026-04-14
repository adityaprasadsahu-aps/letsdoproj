import { useState, useEffect, useRef } from 'react';

function CountdownTimer() {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const endTimeRef = useRef(null);

  useEffect(() => {
    // Set end time only once when component mounts
    if (!endTimeRef.current) {
      endTimeRef.current = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = endTimeRef.current - now;

      if (difference > 0) {
        setTime({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTime({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown-display">
      <div className="countdown-item">
        <span className="countdown-value">{String(time.days).padStart(2, '0')}</span>
        <span className="countdown-label">Days</span>
      </div>
      <span className="countdown-separator">:</span>
      <div className="countdown-item">
        <span className="countdown-value">{String(time.hours).padStart(2, '0')}</span>
        <span className="countdown-label">Hours</span>
      </div>
      <span className="countdown-separator">:</span>
      <div className="countdown-item">
        <span className="countdown-value">{String(time.minutes).padStart(2, '0')}</span>
        <span className="countdown-label">Minutes</span>
      </div>
      <span className="countdown-separator">:</span>
      <div className="countdown-item">
        <span className="countdown-value">{String(time.seconds).padStart(2, '0')}</span>
        <span className="countdown-label">Seconds</span>
      </div>
    </div>
  );
}

export default CountdownTimer;
