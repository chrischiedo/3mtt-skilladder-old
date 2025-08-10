'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '../ui/button';
import Timer from './Timer';
import TimeUpDialog from './TimeUpDialog';
import useDevToolsDetection from './useDevToolsDetection';
import {
  MCQQuestion,
  OpenEndedQuestion,
  AssessmentSession,
  WeeklyScore,
  AssessmentTestProps,
} from './types';

const MCQ_QUESTION_COUNT_PER_MODULE = 50;
const OPEN_ENDED_QUESTION_COUNT_PER_MODULE = 0;
const ASSESSMENT_TIME_LIMIT_MINUTES = 180;

const AssessmentTest: React.FC<AssessmentTestProps> = ({
  mcqQuestions,
  openEndedQuestions,
  cohort,
}) => {
  const router = useRouter();
  const [userAnswers, setUserAnswers] = useState<
    Record<number, string>
  >({});
  const [openEndedAnswers, setOpenEndedAnswers] = useState<
    Record<number, string>
  >({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [mcqScore, setMcqScore] = useState<number>(0);
  const [openEndedScore, setOpenEndedScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const savedSession = localStorage.getItem('assessmentSession');
    if (savedSession) {
      const { timeRemaining } = JSON.parse(
        savedSession
      ) as AssessmentSession;
      return timeRemaining || ASSESSMENT_TIME_LIMIT_MINUTES * 60;
    }
    return ASSESSMENT_TIME_LIMIT_MINUTES * 60;
  });
  const [showTimeUpDialog, setShowTimeUpDialog] =
    useState<boolean>(false);

  // Modified time useEffect
  useEffect(() => {
    if (timeLeft <= 0 || showResults) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime: number) => {
        const newTime = prevTime - 1;

        // Save the updated time to localStorage
        const savedSession = localStorage.getItem(
          'assessmentSession'
        );
        if (savedSession) {
          const sessionData = JSON.parse(
            savedSession
          ) as AssessmentSession;
          sessionData.timeRemaining = newTime;
          localStorage.setItem(
            'assessmentSession',
            JSON.stringify(sessionData)
          );
        }

        if (prevTime === 40) {
          toast.warning('⚠️ Only 40 seconds remaining!', {
            duration: 4000,
            position: 'top-center',
          });
        }

        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmit();
          setShowTimeUpDialog(true);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResults]);

  // Modify the existing useEffect that loads saved answers
  useEffect(() => {
    const savedSession = localStorage.getItem('assessmentSession');
    if (savedSession) {
      const { answers, timeRemaining } = JSON.parse(
        savedSession
      ) as AssessmentSession;
      if (answers.userAnswers) {
        setUserAnswers(answers.userAnswers);
      }
      if (answers.openEndedAnswers) {
        setOpenEndedAnswers(answers.openEndedAnswers);
      }
      // Set the time remaining from storage
      if (timeRemaining) {
        setTimeLeft(timeRemaining);
      }
    }
  }, []);

  const handleMCQOptionChange = (
    questionIndex: number,
    selectedOption: string
  ): void => {
    const updatedAnswers = {
      ...userAnswers,
      [questionIndex]: selectedOption,
    };
    setUserAnswers(updatedAnswers);

    // Update local storage with the new answers
    const savedSession = localStorage.getItem('assessmentSession');
    if (savedSession) {
      const sessionData = JSON.parse(
        savedSession
      ) as AssessmentSession;
      sessionData.answers.userAnswers = updatedAnswers;
      localStorage.setItem(
        'assessmentSession',
        JSON.stringify(sessionData)
      );
    }
  };

  const handleOpenEndedChange = (
    questionIndex: number,
    answer: string
  ): void => {
    const updatedAnswers = {
      ...openEndedAnswers,
      [questionIndex]: answer,
    };
    setOpenEndedAnswers(updatedAnswers);

    // Update local storage with the new answers
    const savedSession = localStorage.getItem('assessmentSession');
    if (savedSession) {
      const sessionData = JSON.parse(
        savedSession
      ) as AssessmentSession;
      sessionData.answers.openEndedAnswers = updatedAnswers;
      localStorage.setItem(
        'assessmentSession',
        JSON.stringify(sessionData)
      );
    }
  };

  const handleSubmit = async (): Promise<void> => {
    let calculatedMCQScore = 0;
    let mcqQuestionsWithScore: MCQQuestion[];
    let openEndedQuestionsWithScore: OpenEndedQuestion[];

    mcqQuestions.forEach((q: MCQQuestion, index: number) => {
      if (userAnswers[index] === q.correct_answer) {
        calculatedMCQScore++;
        q.score = 1;
      } else {
        q.score = 0;
      }
    });

    mcqQuestionsWithScore = mcqQuestions;
    setMcqScore(calculatedMCQScore);

    // Score Open ended questions
    let calculatedOpenEndedScore = 0;

    const questions: string[] = [];
    const answers: string[] = [];
    Object.entries(openEndedAnswers).forEach(([key, value]) => {
      questions.push(openEndedQuestions[parseInt(key)].question_text);
      answers.push(value as string);
    });

    if (questions.length === answers.length && answers.length > 0) {
      try {
        const res = await fetch('/api/evaluate_open_ended_qs/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questions, answers }),
        });
        const data = await res.json();

        calculatedOpenEndedScore = Number(
          data.parsedScore
            .reduce(
              (sum: number, item: { marks: number }) =>
                sum + item.marks,
              0
            )
            .toFixed(1)
        );
        // Update scores for open ended questions
        openEndedQuestions.forEach(
          (q: OpenEndedQuestion, index: number) => {
            const scoreData = data.parsedScore[index];
            q.score = scoreData ? scoreData.marks : 0;
          }
        );

        openEndedQuestionsWithScore = openEndedQuestions;
        setOpenEndedScore(calculatedOpenEndedScore);
      } catch (error) {
        console.error(
          'Error evaluating open-ended questions:',
          error
        );
      }
    } else {
      setOpenEndedScore(calculatedOpenEndedScore);
      // Set score to 0
      openEndedQuestions.forEach((q: OpenEndedQuestion) => {
        q.score = 0;
      });
      openEndedQuestionsWithScore = openEndedQuestions;
    }

    // Calculate weekly scores
    const allQuestionsWithScores = [
      ...mcqQuestionsWithScore,
      ...openEndedQuestionsWithScore,
    ];
    const groupedByWeek = allQuestionsWithScores.reduce<
      Record<string, (MCQQuestion | OpenEndedQuestion)[]>
    >((acc, question) => {
      const week = question.week || 'Unspecified';
      if (!acc[week]) {
        acc[week] = [];
      }
      acc[week].push(question);
      return acc;
    }, {});

    // Calculate totals per week
    const weeklyScores: WeeklyScore[] = Object.entries(
      groupedByWeek
    ).map(([week, questions]) => {
      const totalScore = questions.reduce(
        (sum, q) => sum + (q.score || 0),
        0
      );
      const maxPossibleScore = questions.length;
      const mcqQuestionsCount = questions.filter(
        (q) => 'options' in q
      ).length;
      const openEndedQuestionsCount = questions.filter(
        (q) => !('options' in q)
      ).length;
      const mcqScore = questions
        .filter((q) => 'options' in q)
        .reduce((sum, q) => sum + (q.score || 0), 0);
      const openEndedScore = questions
        .filter((q) => !('options' in q))
        .reduce((sum, q) => sum + (q.score || 0), 0);

      const mcqQuestionsPerModule =
        cohort === 'deeptech' ? MCQ_QUESTION_COUNT_PER_MODULE : 50;

      const mcqPercentage = (
        (mcqScore / mcqQuestionsPerModule) *
        100
      ).toFixed(1);

      const openEndedPercentage =
        cohort === 'cohort_2'
          ? (
              (openEndedScore /
                OPEN_ENDED_QUESTION_COUNT_PER_MODULE) *
              100
            ).toFixed(1)
          : '0';

      return {
        week,
        totalScore,
        maxPossibleScore,
        percentage: ((totalScore / maxPossibleScore) * 100).toFixed(
          1
        ),
        mcqScore,
        openEndedScore,
        mcqPercentage,
        openEndedPercentage,
      };
    });

    // Sort weeks from 1 - 12
    weeklyScores.sort((a, b) => {
      const weekA =
        a.week === 'Unspecified'
          ? -1
          : parseInt(a.week.replace('Week', ''));
      const weekB =
        b.week === 'Unspecified'
          ? -1
          : parseInt(b.week.replace('Week', ''));
      return weekA - weekB;
    });

    try {
      const response = await fetch('/api/update_tech_score/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mcqScore: calculatedMCQScore,
          openEndedScore: calculatedOpenEndedScore,
          scores: weeklyScores,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
      }
    } catch (error) {
      console.error('Error submitting score:', error);
    } finally {
      setIsLoading(false);
    }
    setShowResults(true);

    // Clear local storage on submission
    localStorage.removeItem('assessmentSession');
  };

  const handleDevToolsDetected = (): void => {
    toast.error(
      'Assessment terminated due to suspicious activity. Your answers will be submitted automatically.',
      {
        duration: 5000,
        position: 'top-center',
      }
    );
    handleSubmit(); // Auto-submit the test
    router.push('/dashboard'); // Redirect to dashboard
  };

  useDevToolsDetection(handleDevToolsDetected);

  // Add warning message in the instructions section
  useEffect(() => {
    toast.info(
      'Please note: Using developer tools or certain keyboard shortcuts during the assessment is not allowed.',
      {
        duration: 6000,
        position: 'top-center',
      }
    );
  }, []);

  return (
    <div>
      {!showResults ? (
        <div>
          <Timer timeLeft={timeLeft} onTimeUp={handleSubmit} />
          {showTimeUpDialog && <TimeUpDialog />}
          <h2 className="text-lg font-bold mb-4">MCQ Questions</h2>
          {mcqQuestions.map((q: MCQQuestion, index: number) => (
            <div key={index} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                {q.question_text}
              </h3>
              <div>
                {q.options.map((option: string, optIndex: number) => (
                  <label
                    key={optIndex}
                    className="block mb-1 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`mcq-question-${index}`}
                      value={option}
                      checked={userAnswers[index] === option}
                      onChange={() =>
                        handleMCQOptionChange(index, option)
                      }
                    />{' '}
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <h2 className="text-lg font-bold mb-4">
            Open-ended Questions
          </h2>
          {openEndedQuestions.length > 0 ? (
            openEndedQuestions.map(
              (q: OpenEndedQuestion, index: number) => (
                <div key={index} className="mt-4 mb-2 space-y-2 pb-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {q.question_text}
                  </h3>
                  <textarea
                    className="w-full p-2 border rounded"
                    rows={3}
                    placeholder="Type your response here..."
                    value={openEndedAnswers[index] || ''}
                    onChange={(
                      e: React.ChangeEvent<HTMLTextAreaElement>
                    ) => handleOpenEndedChange(index, e.target.value)}
                  />
                </div>
              )
            )
          ) : (
            <p>No open-ended questions available.</p>
          )}

          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
          >
            Submit Test
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold">Results</h2>
          <p>
            MCQ Score: {mcqScore} out of {mcqQuestions.length}
          </p>
          <p>
            Open-ended Score: {openEndedScore} out of{' '}
            {openEndedQuestions.length}
          </p>

          <div className="mt-4">
            <Link href="/dashboard">
              <Button className="bg-blue-500 text-white px-4 py-2 rounded">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentTest;
