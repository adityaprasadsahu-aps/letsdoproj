import { useState, useEffect, useRef } from 'react';

function CountdownTimer() {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [endTime, setEndTime] = useState(null);

  const endTimeRef = useRef(null);
  const timerRef = useRef(null);

  const calculateTimeLeft = () => {
    if (!endTimeRef.current) return;

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

  useEffect(() => {
    // Fetch sale end time from database
    const fetchSaleInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/sale/current');
        const data = await response.json();

        if (data.success && data.data) {
          const endTimeMs = new Date(data.data.endTime).getTime();
          endTimeRef.current = endTimeMs;
          setEndTime(endTimeMs);
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching sale info:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleInfo();

    // Refresh sale info every 5 minutes to sync with admin updates
    const refreshInterval = setInterval(fetchSaleInfo, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    if (!endTime) return;

    // Calculate immediately
    calculateTimeLeft();

    // Start updating every second
    timerRef.current = setInterval(calculateTimeLeft, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [endTime]);

  if (loading) {
    return (
      <div className="countdown-display">
        <div style={{ color: '#999', textAlign: 'center' }}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="countdown-display">
        <div style={{ color: '#999', textAlign: 'center' }}>Unable to load sale info</div>
      </div>
    );
  }

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
