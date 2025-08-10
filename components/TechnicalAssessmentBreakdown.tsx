import { ScoreGrid } from './score-grid/score-grid';

export function TechnicalAssessmentBreakdown({ scores }) {
  const formattedScores = scores.map((item) => ({
    title: item.week,
    summary: '',
    mcqScore: item.mcqPercentage,
    openEndedScore: item.openEndedPercentage,
    totalScore: item.percentage,
  }));
  return <ScoreGrid scores={formattedScores} />;
}
