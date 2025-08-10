import { ScoreGrid } from './score-grid/score-grid';

export function SFIAAssessmentBreakdown({ scores }) {
  const formattedScores = Object.values(scores).map((item) => ({
    title: `Level${item?.level}`,
    summary: '',
    mcqScore: item?.mcqPercentage || 0,
    openEndedScore: item?.openEndedPercentage || 0,
    totalScore: item?.percentage || 0,
  }));
  //   const formattedScores = scores.map((item) => ({
  //     title: item?.level,
  //     summary: '',
  //     mcqScore: item?.mcqPercentage || 0,
  //     openEndedScore: item?.openEndedPercentage || 0,
  //     totalScore: item?.percentage || 0,
  //   }));
  return <ScoreGrid scores={formattedScores} />;
}
