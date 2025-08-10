'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { StepNavigation } from '@/components/StepNavigation';

type Question = {
  question: string;
  category: string;
};

const Assessment = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>(
    {}
  );
  const [remainingTime, setRemainingTime] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState<
    string | null
  >(null);
  const [showStepNavigation, setShowStepNavigation] = useState<boolean>(false);

  useEffect(() => {
    // Fetch questions from the JSON file
    fetch('/riasec_questions.json')
      .then((response) => response.json())
      .then((data: Question[]) => setQuestions(data));
  }, []);

  // useEffect(() => {
  //   if (questions.length === 0) return;

  //   const timer = setInterval(() => {
  //     setRemainingTime((prevTime) => {
  //       if (prevTime === 1) {
  //         moveToNextQuestion();
  //         return 5; // Reset timer
  //       }
  //       return prevTime - 1;
  //     });
  //   }, 1000);

  //   return () => clearInterval(timer); // Cleanup timer on question change
  // }, [currentQuestionIndex, questions]);

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const moveToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      //setRemainingTime(5); // Reset timer
    }
  };

  const handleResponse = (value: string) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestionIndex]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/upload_riasec_results/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ results: responses }),
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissionMessage(data.message);
        toast.success(data.message)
        //router.push('/dashboard');
        setShowStepNavigation(true)
      } else {
        const errorData = await response.json();
        setSubmissionMessage(`Error: ${errorData.error}`);
        toast.error('Error occured while saving')
      }
    } catch (error) {
      console.error('Submission failed:', error);
      setSubmissionMessage(
        'An error occurred while submitting the responses.'
      );
      toast.error('An error occurred while submitting the responses.')
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 text-center bg-gradient-to-br from-blue-400 to-gray-100">
        <h1 className="text-2xl font-bold mb-4">RIASEC Assessment</h1>
        <p className="text-gray-600 italic mb-6">
          Please select Yes or No for each statement.
        </p>

        {questions.length > 0 && (
          <>
            {/* Countdown Timer */}
            {/* <div className="relative mb-4">
              <div className="w-12 h-12 rounded-full border-4 border-gray-300 flex items-center justify-center mx-auto">
                <span className="text-blue-500 font-bold text-lg">
                  {remainingTime}
                </span>
              </div>
            </div> */}

            {/* Questions */}
            <div className="mb-6">
              <p className="text-lg font-medium mb-4">
                {questions[currentQuestionIndex]?.question}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className={`px-4 py-2 rounded-lg font-bold ${
                    responses[currentQuestionIndex] === 'yes'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => handleResponse('yes')}
                >
                  Yes
                </button>
                <button
                  className={`px-4 py-2 rounded-lg font-bold ${
                    responses[currentQuestionIndex] === 'no'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => handleResponse('no')}
                >
                  No
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg font-bold disabled:bg-gray-100 disabled:text-gray-400"
                onClick={moveToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold"
                  onClick={moveToNextQuestion}
                >
                  Next
                </button>
              ) : (
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              )}
            </div>
          </>
        )}

        {/* Submission Message */}
        {submissionMessage && (
          <div className="mt-4 text-lg font-medium text-gray-800">
            {submissionMessage}
          </div>
        )}
      </div>
      <StepNavigation 
      title="All done" 
      subtitle='Congratulations! You have completed the assessment. You can now go to the dashboard to review your performance.' 
      nextButtonHref='/dashboard' 
      nextButtonText='Review Evaluation'
      isOpen={showStepNavigation}>
      </StepNavigation>
    </div>
  );
};

export default Assessment;
