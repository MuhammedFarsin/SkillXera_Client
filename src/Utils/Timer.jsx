import { useState, useEffect } from 'react';

const Timer = () => {
  // Initial time (10h 50m 27s)
  const initialTime = { hours: 10, minutes: 50, seconds: 27 };
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { hours, minutes, seconds } = prevTime;

        // If time hits 00:00:00, reset to initial time
        if (hours === 0 && minutes === 0 && seconds === 0) {
          return initialTime; // Reset the timer
        }

        // Decrement time
        if (seconds > 0) {
          seconds--;
        } else {
          if (minutes > 0) {
            minutes--;
            seconds = 59;
          } else {
            if (hours > 0) {
              hours--;
              minutes = 59;
              seconds = 59;
            }
          }
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup
  }, []);

  return (
    <div className="flex justify-center mt-4 w-full">
      <div className="bg-[#333] text-[#FFD700] py-3 px-6 text-center rounded-3xl flex flex-wrap justify-between items-center gap-3 lg:gap-6">
        <div className="text-center">
          <p className="text-2xl lg:text-[44px] font-bold">
            {String(timeLeft.hours).padStart(2, '0')}
          </p>
          <p className="text-xs lg:text-lg text-white">HOURS</p>
        </div>
        <p className="text-2xl lg:text-[44px] font-bold">:</p>
        <div className="text-center">
          <p className="text-2xl lg:text-[44px] font-bold">
            {String(timeLeft.minutes).padStart(2, '0')}
          </p>
          <p className="text-xs lg:text-lg text-white">MINUTES</p>
        </div>
        <p className="text-2xl lg:text-[44px] font-bold">:</p>
        <div className="text-center">
          <p className="text-2xl lg:text-[44px] font-bold">
            {String(timeLeft.seconds).padStart(2, '0')}
          </p>
          <p className="text-xs lg:text-lg text-white">SECONDS</p>
        </div>
      </div>
    </div>
  );
};

export default Timer;