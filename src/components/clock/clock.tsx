import { useCallback, useEffect, useMemo, useState } from "react";

const Clock = () => {
  const [date, setDate] = useState(new Date());

  const tick = useCallback(() => {
    setDate(new Date());
  }, []);

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return () => clearInterval(timerID);
  }, [tick]);

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
  };

  const formattedTime = useMemo(
    () => date.toLocaleTimeString("en-US", timeOptions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [date],
  );

  const formattedDate = useMemo(
    () => date.toLocaleDateString("en-US", dateOptions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [date],
  );

  return (
    <span className="text-gray-600 text-xl">
      {formattedTime} • {formattedDate}
    </span>
  );
};

export default Clock;
