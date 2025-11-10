import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

/**
 * Hook that provides the current time and updates periodically
 * Updates every hour to keep time-based calculations accurate
 */
export function useNow() {
  const [now, setNow] = useState(() => dayjs());

  useEffect(() => {
    // Update immediately
    setNow(dayjs());

    // Update every hour to keep it dynamic
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 60 * 60 * 1000); // Update every hour

    return () => clearInterval(interval);
  }, []);

  return now;
}

