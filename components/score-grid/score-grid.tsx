import React from 'react';
import { ScoreCircle } from './score-circle';

interface ScoreGridItemProps {
  title: string;
  summary: string;
  mcqScore: number;
  openEndedScore: number;
  totalScore: number;
}

function ScoreGridItem({
  title,
  summary,
  mcqScore,
  openEndedScore,
  totalScore,
}: ScoreGridItemProps) {
  const getTotalScoreColor = (score: number) => {
    if (score >= 70) return 'bg-green-600';
    if (score >= 50 && score < 69) return 'bg-yellow-600';
    if (score >= 25 && score < 49) return 'bg-red-400';
    if (score >= 1 && score < 25) return 'bg-red-500';
    return 'bg-red-700';
  };

  return (
    <div className="bg-white  rounded-lg p-3 mt-4 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
      <div className="flex-1">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="text-gray-600 text-sm">{summary}</p>
      </div>
      <div className="flex space-x-4">
        <ScoreCircle
          score={mcqScore}
          label="MCQ Score %"
          color={getTotalScoreColor(mcqScore)}
        />
        <ScoreCircle
          score={openEndedScore}
          label="Open Ended Score %"
          color={getTotalScoreColor(openEndedScore)}
        />
        <ScoreCircle
          score={totalScore}
          label="Total Score %"
          color={getTotalScoreColor(totalScore)}
        />
      </div>
    </div>
  );
}

export function ScoreGrid({ scores = [] }) {
  return (
    <div className="container mx-auto p-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scores.length > 0 &&
          scores.map((item, index) => (
            <ScoreGridItem key={index} {...item} />
          ))}
      </div>
    </div>
  );
}
