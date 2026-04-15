import { useState, useEffect, useRef } from 'react';
import '../styles/CountdownTimer.css';

function CountdownTimer() {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [countdownData, setCountdownData] = useState(null);
  const [loading, setLoading] = useState(true);
  const endTimeRef = useRef(null);

  useEffect(() => {
    const fetchCountdown = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/countdown');
        const data = await response.json();
        setCountdownData(data);
        if (data && data.endTime) {
          endTimeRef.current = new Date(data.endTime).getTime();
        }
      } catch (error) {
        console.error('Error fetching countdown:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountdown();
  }, []);

  useEffect(() => {
    if (!endTimeRef.current) return;

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
  }, [countdownData]);

  if (loading) {
    return <div className="countdown-loading">Loading countdown...</div>;
  }

  if (!countdownData) {
    return <div className="countdown-no-timer">No active countdown timer</div>;
  }

  return (
    <div className="countdown-container">
      {countdownData.title && (
        <div className="countdown-header">
          <h3 className="countdown-title">{countdownData.title}</h3>
          {countdownData.description && (
            <p className="countdown-description">{countdownData.description}</p>
          )}
        </div>
      )}
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
    </div>
  );
}

export default CountdownTimer;
