import React from 'react';

interface ScoreCircleProps {
  score: number;
  label: string;
  color?: string;
}

export function ScoreCircle({
  score,
  label,
  color = 'bg-blue-500',
}: ScoreCircleProps) {
  return (
    <div className="flex flex-col items-center ">
      <div
        className={`${color} w-12 h-12 rounded-full flex items-center justify-center mb-2`}
      >
        <span className="text-white text-xl font-bold">{score}</span>
      </div>
      <span className="text-[11px] text-gray-600 w-12 text-center">
        {label}
      </span>
    </div>
  );
}
