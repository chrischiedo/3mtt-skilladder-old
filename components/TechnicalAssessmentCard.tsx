'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from './ui/button';
import debounce from 'debounce';

const MCQ_QUESTION_COUNT_PER_MODULE = 2;
const OPEN_ENDED_QUESTION_COUNT_PER_MODULE = 1;

const ASSESSMENT_SESSION_EXPIRY = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
// const ASSESSMENT_SESSION_EXPIRY = 3 * 60 * 1000; // 3 minutes in milliseconds
let ASSESSMENT_TIME_LIMIT_MINUTES = 180; // 45 minutes for the assessment

const Timer = ({
  timeLeft,
  onTimeUp,
}: {
  timeLeft: number;
  onTimeUp: () => void;
}) => {
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

const TimeUpDialog = () => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md">
        <h2 className="text-xl font-bold mb-4">Time's Up!</h2>
        <p>
          Your assessment time has expired. Your answers have been
          automatically submitted.
        </p>
      </div>
    </div>
  );
};

const TechnicalAssessmentCard = ({
  selected_career,
  cohort,
  self_ratings,
}: {
  selected_career: string;
  cohort: string;
  self_ratings: any;
}) => {
  const router = useRouter();
  const [mcqQuestions, setMcqQuestions] = useState([]);
  const [openEndedQuestions, setOpenEndedQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTest, setShowTest] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [userAnswers, setUserAnswers] = useState({});
  const [openEndedAnswers, setOpenEndedAnswers] = useState({});

  useEffect(() => {
    // Check local storage for existing session
    const savedSession = localStorage.getItem('assessmentSession');
    if (savedSession) {
      const sessionData = JSON.parse(savedSession);
      const savedTime = sessionData.timestamp;
      const currentTime = new Date().getTime();

      // Check if session has expired
      if (currentTime - savedTime > ASSESSMENT_SESSION_EXPIRY) {
        // Clear expired session
        localStorage.removeItem('assessmentSession');
      } else {
        // Load saved session data
        const { questions, answers } = sessionData;
        setMcqQuestions(questions.mcqQuestions || []);
        setOpenEndedQuestions(questions.openEndedQuestions || []);
        setUserAnswers(answers.userAnswers || {});
        setOpenEndedAnswers(answers.openEndedAnswers || {});
        setShowTest(true);
      }
    }
  }, []);

  //set time limit based on cohort
  useEffect(() => {
    if (cohort === 'cohort_2') {
      ASSESSMENT_TIME_LIMIT_MINUTES = 180; // 3 hours for the assessment
    } else if (cohort === 'cohort_3') {
      ASSESSMENT_TIME_LIMIT_MINUTES = 60; // 1 hours for the assessment
    } else if (cohort === 'deeptech') {
      ASSESSMENT_TIME_LIMIT_MINUTES = 60; // 3 hours for the assessment
    }
  }, [cohort]);

  const generateTechnicalAssessmentQuestions = async (
    course,
    ratings,
    cohort
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      // Generate MCQ Questions
      const response = await fetch(
        '/api/generate_tech_assessment_questions/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ course, ratings, cohort }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.mcqQuestions && Array.isArray(data.mcqQuestions)) {
          setMcqQuestions(data.mcqQuestions);

          // Save questions to local storage with timestamp and initial time
          localStorage.setItem(
            'assessmentSession',
            JSON.stringify({
              questions: {
                mcqQuestions: data.mcqQuestions,
                openEndedQuestions: [],
              },
              answers: {
                userAnswers: {},
                openEndedAnswers: {},
              },
              timestamp: new Date().getTime(),
              timeRemaining: ASSESSMENT_TIME_LIMIT_MINUTES * 60, // Initialize with full time
            })
          );

          // Generate Open-ended Questions
          const openEndedResponse = await fetch(
            '/api/generate_openended_assessment',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ course, ratings, cohort }),
            }
          );

          if (openEndedResponse.ok) {
            const openEndedData = await openEndedResponse.json();
            if (
              openEndedData.openEndedQuestions &&
              Array.isArray(openEndedData.openEndedQuestions)
            ) {
              setOpenEndedQuestions(openEndedData.openEndedQuestions);

              // Update local storage to include open-ended questions
              const savedSession = localStorage.getItem(
                'assessmentSession'
              );
              if (savedSession) {
                const sessionData = JSON.parse(savedSession);
                sessionData.questions.openEndedQuestions =
                  openEndedData.openEndedQuestions;
                localStorage.setItem(
                  'assessmentSession',
                  JSON.stringify(sessionData)
                );
              }
            }
          } else {
            console.warn('Failed to fetch open-ended questions.');
          }

          setShowTest(true);
        } else {
          throw new Error(
            'Invalid response format for MCQ questions.'
          );
        }
      } else {
        throw new Error('Failed to fetch MCQ questions.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const startTest = () => {
    setIsLoading(true);
    setTimeout(() => {
      setShowInstructions(false);
      setIsLoading(false);
    }, 5000);
  };

  return (
    <div className="p-6">
      {showInstructions ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">
            Technical Assessment Instructions
          </h1>
          <p className="mb-4">
            This technical assessment is designed to evaluate your
            skills and competencies in your chosen career path. It
            includes both multiple-choice and open-ended questions to
            test your knowledge and problem-solving abilities.
          </p>
          <h2 className="text-lg font-semibold mb-2">
            Assessment Structure
          </h2>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>MCQ Questions:</strong> Choose the correct
              answer from the options provided.
            </li>
            <li>
              <strong>Open-ended Questions:</strong> Provide detailed
              responses to showcase your understanding and critical
              thinking.
            </li>
          </ul>
          <h2 className="text-lg font-semibold mb-2">How It Works</h2>
          <p className="mb-4">
            You will be presented with a set of questions. Your
            answers will be evaluated, and scores will be recorded for
            both MCQs and open-ended questions. Make sure to read the
            questions carefully and provide your best response.
          </p>

          <div className="text-center">
            <button
              onClick={startTest}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {isLoading ? 'Loading Test...' : 'Start Assessment'}
            </button>
          </div>

          {/* {cohort == 'cohort_2' || true ? (
            <div className="text-center">
              <button
                onClick={startTest}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {isLoading ? 'Loading Test...' : 'Start Assessment'}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg font-semibold">Technical Assessment for other cohorts other than Cohort 2 is not live yet. Kindly check back later.</p>
              <Link href="/dashboard">
                <button className="bg-blue-500 text-white px-4 py-2 rounded mt04">
                  Back to Dashboard
                </button>
              </Link>
            </div>
          )} */}
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">
            Technical Assessment
          </h1>
          {!showTest ? (
            <div>
              <button
                onClick={() =>
                  generateTechnicalAssessmentQuestions(
                    // selected_career.selectedCourse,
                    // selected_career.self_ratings
                    selected_career,
                    self_ratings,
                    cohort
                  )
                }
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Start Test
              </button>
              {isLoading && <p>Starting Test...</p>}
              {error && <p className="text-red-500">{error}</p>}
            </div>
          ) : (
            <AssessmentTest
              mcqQuestions={mcqQuestions}
              openEndedQuestions={openEndedQuestions}
              cohort={cohort}
            />
          )}
        </div>
      )}
    </div>
  );
};

const useDevToolsDetection = (onDevToolsOpen: () => void) => {
  useEffect(() => {
    let warningCount = 0;
    const MAX_WARNINGS = 3;

    // Function to handle developer tools detection
    const handleDevTools = () => {
      warningCount++;
      if (warningCount <= MAX_WARNINGS) {
        toast.warning(
          `Warning ${warningCount}/${MAX_WARNINGS}: Developer tools detected. Please close them to continue the assessment.`,
          {
            duration: 4000,
            position: 'top-center',
          }
        );
      } else {
        onDevToolsOpen();
      }
    };

    // Check for developer tools by window size difference
    const checkDevTools = () => {
      const threshold = 100;
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        handleDevTools();
      }
    };

    // Prevent keyboard shortcuts
    const preventDevTools = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        handleDevTools();
      }
    };

    // Set up interval to check window size
    const interval = setInterval(checkDevTools, 1000);

    // Add keyboard event listener
    window.addEventListener('keydown', preventDevTools);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', preventDevTools);
    };
  }, [onDevToolsOpen]);
};

const AssessmentTest = ({
  mcqQuestions,
  openEndedQuestions,
  cohort,
}) => {
  const router = useRouter();
  const [userAnswers, setUserAnswers] = useState({});
  const [openEndedAnswers, setOpenEndedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [mcqScore, setMcqScore] = useState(0);
  const [openEndedScore, setOpenEndedScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // Initialize timeLeft from localStorage or default value
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedSession = localStorage.getItem('assessmentSession');
    if (savedSession) {
      const { timeRemaining } = JSON.parse(savedSession);
      return timeRemaining || ASSESSMENT_TIME_LIMIT_MINUTES * 60;
    }
    return ASSESSMENT_TIME_LIMIT_MINUTES * 60;
  });
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);

  // Modified time useEffect
  useEffect(() => {
    if (timeLeft <= 0 || showResults) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;

        // Save the updated time to localStorage
        const savedSession = localStorage.getItem(
          'assessmentSession'
        );
        if (savedSession) {
          const sessionData = JSON.parse(savedSession);
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
      const { answers, timeRemaining } = JSON.parse(savedSession);
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

  const handleMCQOptionChange = (questionIndex, selectedOption) => {
    const updatedAnswers = {
      ...userAnswers,
      [questionIndex]: selectedOption,
    };
    setUserAnswers(updatedAnswers);

    // Update local storage with the new answers
    const savedSession = localStorage.getItem('assessmentSession');
    if (savedSession) {
      const sessionData = JSON.parse(savedSession);
      sessionData.answers.userAnswers = updatedAnswers;
      localStorage.setItem(
        'assessmentSession',
        JSON.stringify(sessionData)
      );
    }
  };

  const handleOpenEndedChange = (questionIndex, answer) => {
    const updatedAnswers = {
      ...openEndedAnswers,
      [questionIndex]: answer,
    };
    setOpenEndedAnswers(updatedAnswers);

    // Update local storage with the new answers
    const savedSession = localStorage.getItem('assessmentSession');
    if (savedSession) {
      const sessionData = JSON.parse(savedSession);
      sessionData.answers.openEndedAnswers = updatedAnswers;
      localStorage.setItem(
        'assessmentSession',
        JSON.stringify(sessionData)
      );
    }
  };

  const handleSubmit = async () => {
    let calculatedMCQScore = 0;
    let mcqQuestionsWithScore;
    let openEndedQuestionsWithScore;

    mcqQuestions.forEach((q, index) => {
      if (userAnswers[index] === q.correct_answer) {
        calculatedMCQScore++;
        //update score
        q.score = 1;
      } else {
        q['score'] = 0;
      }
    });

    mcqQuestionsWithScore = mcqQuestions;

    setMcqScore(calculatedMCQScore);
    console.log('Calculated Scores: ', calculatedMCQScore);

    //Score Open ended questions
    let calculatedOpenEndedScore = 0;

    //console.log('qq', JSON.stringify(mcqQuestions, null, 2));

    const questions = [];
    const answers = [];
    Object.entries(openEndedAnswers).forEach(([key, value]) => {
      questions.push(openEndedQuestions[key].question_text),
        answers.push(value);
    });

    //console.log(openEndedAnswers);
    //console.log(answers.length);

    if (questions.length == answers.length && answers.length > 0) {
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
        openEndedQuestions.forEach((q, index) => {
          const scoreData = data.parsedScore[index];
          q.score = scoreData ? scoreData.marks : 0;
        });

        openEndedQuestionsWithScore = openEndedQuestions;

        setOpenEndedScore(calculatedOpenEndedScore);
      } catch (error) {
        //console.log('Error evaluating open-ended questions.');
      }
    } else {
      setOpenEndedScore(calculatedOpenEndedScore);
      //set score to 0
      openEndedQuestions.forEach((q, index) => {
        q.score = 0;
      });
      openEndedQuestionsWithScore = openEndedQuestions;
    }

    //breakdown score
    // Merge and group questions by week
    const allQuestionsWithScores = [
      ...mcqQuestionsWithScore,
      ...openEndedQuestionsWithScore,
    ];
    const groupedByWeek = allQuestionsWithScores.reduce(
      (acc, question) => {
        const week = question.week || 'Unspecified';
        if (!acc[week]) {
          acc[week] = [];
        }
        acc[week].push(question);
        return acc;
      },
      {}
    );

    // Calculate totals per week
    const weeklyScores = Object.entries(groupedByWeek).map(
      ([week, questions]) => {
        const totalScore = questions.reduce(
          (sum, q) => sum + (q.score || 0),
          0
        );
        const maxPossibleScore = questions.length; // Assuming each question is worth 1 point
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
          cohort === 'cohort_2' ? MCQ_QUESTION_COUNT_PER_MODULE : 3;

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
            : 0;

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
      }
    );

    //sort weeks from 1 - 12
    weeklyScores.sort((a, b) => {
      // Extract numbers from "Week1", "Week2" etc format, handling 'Unspecified'
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
    //console.log('Weekly breakdown:', weeklyScores);

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
        //console.log('API Response:', data);
      }
    } catch (error) {
      console.log('Error submitting score: ', error);
    } finally {
      setIsLoading(false);
    }
    setShowResults(true);

    // Clear local storage on submission
    localStorage.removeItem('assessmentSession');
  };

  const handleDevToolsDetected = () => {
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
          {mcqQuestions.map((q, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                {q.question_text}
              </h3>
              <div>
                {q.options.map((option, optIndex) => (
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
            openEndedQuestions.map((q, index) => (
              <div key={index} className="mt-4 mb-2 space-y-2 pb-6">
                <h3 className="text-xl font-semibold mb-2">
                  {q.question_text}
                </h3>
                <textarea
                  className="w-full p-2 border rounded"
                  rows="3"
                  placeholder="Type your response here..."
                  value={openEndedAnswers[index] || ''}
                  onChange={(e) =>
                    handleOpenEndedChange(index, e.target.value)
                  }
                />
              </div>
            ))
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

export default TechnicalAssessmentCard;
