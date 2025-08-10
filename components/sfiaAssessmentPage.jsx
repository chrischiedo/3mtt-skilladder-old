'use client';

import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const levelPassingPercentage = 70;

export default function AssessmentPage({
  selectedCareer,
  currentSfiaLevel,
  cohort
}) {
  const [currentLevel, setCurrentLevel] = useState(
    currentSfiaLevel ? currentSfiaLevel + 1 : 1
  ); //show quiz for next level if previous level is done
  const [allMcqQuestions, setAllMcqQuestions] = useState({});
  const [allOpenQuestions, setAllOpenQuestions] = useState({});
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [openAnswers, setOpenAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [highestLevelCleared, setHighestLevelCleared] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showInstructions, setShowInstructions] = useState(true); // Toggle between instructions and assessment
  const [showAssessmentDialog, setShowAssessmentDialog] =
    useState(false);
  const [dialogConfig, setDialogConfig] = useState(null);

  const fetchAllQuestions = async () => {
    setIsLoading(true);
    try {
      const mcqRes = await fetch(
        '/api/generate_sfia_assessment_mcq/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ course: selectedCareer }),
        }
      );

      const openRes = await fetch(
        '/api/generate_sfia_assessment_open/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ course: selectedCareer }),
        }
      );

      const mcqData = await mcqRes.json();
      const openData = await openRes.json();
    
      setAllMcqQuestions(mcqData.mcqQuestionsByLevel);
      setAllOpenQuestions(openData.mcqQuestionsByLevel);

     
    } catch (error) {
      setErrorMessage('Failed to load questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!showInstructions) {
      fetchAllQuestions();
    }
  }, [showInstructions]);

  const evaluateOpenEnded = async () => {
    const answeredQuestions = Object.entries(openAnswers).filter(
      ([, answer]) => answer.trim() !== ''
    );

    if (answeredQuestions.length === 0) return 0;

    const questions = answeredQuestions.map(([question]) => question);
    const answers = answeredQuestions.map(([, answer]) => answer);

    try {
      const res = await fetch('/api/evaluate_open_ended_qs/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions, answers }),
      });
      const data = await res.json();

      return data.parsedScore.reduce(
        (sum, item) => sum + item.marks,
        0
      );
    } catch (error) {
      setErrorMessage('Error evaluating open-ended questions.');
      return 0;
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const currentMcqQuestions =
      allMcqQuestions[`Level${currentLevel}`] || [];
    const currentOpenQuestions =
      allOpenQuestions[`Level${currentLevel}`] || [];

    const mcqScore = currentMcqQuestions.reduce(
      (sum, q) =>
        mcqAnswers[q.question_text] === q.correct_answer
          ? sum + 1
          : sum,
      0
    );

    const openScore = await evaluateOpenEnded();
    const totalScore = mcqScore + openScore;
    const maxScore =
      currentMcqQuestions.length + currentOpenQuestions.length;

    const percentage = parseFloat(
      (totalScore / maxScore) * 100
    ).toFixed(1);

    setScore(percentage);

    //save score
    try {
      const res = await fetch('/api/upload_sfia1_result/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: currentLevel,
          mcqScore,
          openEndedScore: openScore,
          totalScore,
          percentage,
          assessmentPassed: percentage >= levelPassingPercentage,
          mcqQuestionCount: currentMcqQuestions.length,
          openEndedQuestionCount: currentOpenQuestions.length,
          mcqPercentage: parseFloat(
            (mcqScore / currentMcqQuestions.length) * 100
          ).toFixed(1),
          openEndedPercentage: parseFloat(
            (openScore / currentOpenQuestions.length) * 100
          ).toFixed(1),
        }),
      });
    } catch (error) {
      console.log('Error saving sfia level');
    }

    if (percentage >= levelPassingPercentage) {
      setHighestLevelCleared(currentLevel);
      setCurrentLevel((prev) => prev + 1);
      // alert(
      //   `Congratulations! You have successfully completed Level ${currentLevel}. You will now proceed to Level ${currentLevel + 1}.`
      // );
      setDialogConfig({
        title: `Level ${currentLevel} Completed!`,
        message:
          'You have successfully completed Level ' +
          currentLevel +
          '. You will now proceed to Level ' +
          (currentLevel + 1) +
          '.',
      });
      setShowAssessmentDialog(true);
      // try {
      //   const res = await fetch('/api/upload_sfia1_result/', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ level: currentLevel }),
      //   });
      // } catch (error) {
      //   console.log('Error saving sfia level');
      // }
    } else {
      // alert(
      //   `You did not pass Level ${currentLevel}. Please try again or exit.`
      // );
      setDialogConfig({
        title: `You did not pass Level ${currentLevel}. Please try again or exit`,
        message: `Unfortunately, you did not pass Level ${currentLevel}. `,
        canProceed: false,
      });
      setShowAssessmentDialog(true);
    }

    setIsLoading(false);
  };

  const handleExit = () => {
    if (highestLevelCleared === 0) {
      alert('You have not completed any levels yet.');
    } else {
      alert(`You have cleared up to Level ${highestLevelCleared}.`);
    }
  };

  const handleMcqChange = (questionText, answer) => {
    setMcqAnswers((prev) => ({ ...prev, [questionText]: answer }));
  };

  const handleOpenChange = (questionText, answer) => {
    setOpenAnswers((prev) => ({ ...prev, [questionText]: answer }));
  };

  const startAssessment = () => {
    setIsLoading(true);
    setTimeout(() => {
      setShowInstructions(false);
      setIsLoading(false);
    }, 5000);
  };

  const currentMcqQuestions =
    allMcqQuestions[`Level${currentLevel}`] || [];
  const currentOpenQuestions =
    allOpenQuestions[`Level${currentLevel}`] || [];

  return (
    <div className="container mx-auto p-6">
      {showInstructions ? (
        <div>
          <h1 className="text-3xl font-bold mb-4">
            Professional Capability Assessment Instructions
          </h1>

          <p className="mb-4">
            This assessment is a structured way to assess skills in technology
            and digital industries. You will progress through levels
            based on your performance, starting from Level 1.
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Level 1:</strong> Basic understanding of
              concepts.
            </li>
            <li>
              <strong>Level 2:</strong> Operational tasks under
              supervision.
            </li>
            <li>
              <strong>Level 3:</strong> Independent application of
              skills.
            </li>
            <li>
              <strong>Level 4:</strong> Implement large scale projects
            </li>
            <li>
              <strong>Level 5:</strong> Leading skills.
            </li>
            <li>
              <strong>Level 6:</strong> Managerial Skills
            </li>
            <li>
              <strong>Level 7:</strong> Strategic Skills.
            </li>
          </ul>
          <p className="mb-4">
            You need at least 70% to pass each level.
          </p>
          <div className="text-center">
            {currentLevel < 7 && (
              <>
              {cohort === 'cohort_2' ? (
                <button
                  onClick={startAssessment}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {isLoading
                    ? 'Loading Assessment...'
                    : `Start Level ${currentLevel} Assessment`}
                </button>
              ) : (
                <div className="text-center">
                  <p>Assessment for your cohort is not available. Please check back later.</p>
                  <Link href="/dashboard">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
                      Go to Dashboard
                    </button>
                  </Link>
                </div>
              )}
              </>
            )}
            {currentLevel > 6 && (
              <Link href="/dashboard">
                <button
                
                  className="bg-blue-500/50 text-white px-4 py-2 rounded px-2"
                >
                  Go to Dashboard
                </button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">Professional Capability Assessment</h1>
          {isLoading && <div className="spinner">Loading...</div>}
          {errorMessage && (
            <p className="text-red-500">{errorMessage}</p>
          )}

          {!isLoading && (
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Level {currentLevel}
              </h2>
              <div className="mb-4">
                <h3 className="font-bold">MCQ Questions</h3>
                {currentMcqQuestions.map((q, index) => (
                  <div key={index} className="mt-4 mb-2 space-y-2 pb-6">
                    <p className="text-xl font-semibold">{q.question_text}</p>
                    {q.options.map((opt, optIndex) => (
                      <label key={optIndex} className="block text-lg">
                        <input
                          type="radio"
                          name={q.question_text}
                          value={opt}
                          onChange={(e) =>
                            handleMcqChange(
                              q.question_text,
                              e.target.value
                            )
                          }
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <h3 className="font-bold">Open-Ended Questions</h3>
                {currentOpenQuestions.map((q, index) => (
                  <div key={index} className="mt-4 mb-2 space-y-3 pb-6">
                    <p className="text-xl font-semibold">{q.question_text}</p>
                    <textarea
                      className="border rounded w-full p-2"
                      onChange={(e) =>
                        handleOpenChange(
                          q.question_text,
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}
              </div>

              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSubmit}
              >
                Submit Level
              </button>

              <button
                className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                onClick={handleExit}
              >
                Exit
              </button>
            </div>
          )}
        </div>
      )}
      <AssessmentDialog
        isOpen={showAssessmentDialog}
        toggleOpen={() =>
          setShowAssessmentDialog(!showAssessmentDialog)
        }
        {...dialogConfig}
      />
    </div>
  );
}

export function AssessmentDialog({
  isOpen,
  toggleOpen,
  title,
  message,
  canProceed,
  passed,
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={toggleOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Link href="/dashboard">
            <Button variant={'outline'} className="border-red-400">
              Go to Dashboard
            </Button>
          </Link>
          {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
          {canProceed && (
            <AlertDialogAction>Continue</AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
