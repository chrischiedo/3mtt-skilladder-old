'use client';
import React from 'react';

interface TimerProps {
  timeLeft: number;
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ timeLeft, onTimeUp }) => {
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  // Add dynamic classes based on time remaining
  const timerClasses = `fixed top-4 right-4 shadow-lg rounded-lg p-3 font-mono text-lg ${
    timeLeft < 60 ? 'bg-red-500 text-white' : 'bg-white'
  }`;

  return (
    <div className={timerClasses}>
      Time Left: {hours.toString().padStart(2, '0')}:
      {minutes.toString().padStart(2, '0')}:
      {seconds.toString().padStart(2, '0')}
    </div>
  );
};

export default Timer;
