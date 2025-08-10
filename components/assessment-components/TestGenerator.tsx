'use client';
import React from 'react';
import {
  MCQQuestion,
  OpenEndedQuestion,
  AssessmentSession,
} from './types';

interface TestGeneratorProps {
  selected_career: string;
  cohort: string;
  self_ratings: Record<string, number>;
  onQuestionsGenerated: (
    mcqQuestions: MCQQuestion[],
    openEndedQuestions: OpenEndedQuestion[]
  ) => void;
  onError: (error: string) => void;
}

const ASSESSMENT_TIME_LIMIT_MINUTES = 180;

const TestGenerator: React.FC<TestGeneratorProps> = ({
  selected_career,
  cohort,
  self_ratings,
  onQuestionsGenerated,
  onError,
}) => {
  const generateTechnicalAssessmentQuestions =
    async (): Promise<void> => {
      try {
        // Generate MCQ Questions
        const response = await fetch(
          '/api/generate_deeptech_assessment_questions/',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              course: selected_career,
              ratings: self_ratings,
              cohort,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();

          if (data.mcqQuestions && Array.isArray(data.mcqQuestions)) {
            // Save questions to local storage with timestamp and initial time
            const sessionData: AssessmentSession = {
              questions: {
                mcqQuestions: data.mcqQuestions,
                openEndedQuestions: [],
              },
              answers: {
                userAnswers: {},
                openEndedAnswers: {},
              },
              timestamp: new Date().getTime(),
              timeRemaining: ASSESSMENT_TIME_LIMIT_MINUTES * 60,
            };
            localStorage.setItem(
              'assessmentSession',
              JSON.stringify(sessionData)
            );

            // Generate Open-ended Questions
            const openEndedResponse = await fetch(
              '/api/generate_deeptech_openended_questions',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  course: selected_career,
                  ratings: self_ratings,
                  cohort,
                }),
              }
            );

            if (openEndedResponse.ok) {
              const openEndedData = await openEndedResponse.json();
              if (
                openEndedData.openEndedQuestions &&
                Array.isArray(openEndedData.openEndedQuestions)
              ) {
                // Update local storage to include open-ended questions
                const savedSession = localStorage.getItem(
                  'assessmentSession'
                );
                if (savedSession) {
                  const sessionData = JSON.parse(
                    savedSession
                  ) as AssessmentSession;
                  sessionData.questions.openEndedQuestions =
                    openEndedData.openEndedQuestions;
                  localStorage.setItem(
                    'assessmentSession',
                    JSON.stringify(sessionData)
                  );
                }
                onQuestionsGenerated(
                  data.mcqQuestions,
                  openEndedData.openEndedQuestions
                );
              }
            } else {
              console.warn('Failed to fetch open-ended questions.');
              onQuestionsGenerated(data.mcqQuestions, []);
            }
          } else {
            throw new Error(
              'Invalid response format for MCQ questions.'
            );
          }
        } else {
          throw new Error('Failed to fetch MCQ questions.');
        }
      } catch (error) {
        onError(
          error instanceof Error
            ? error.message
            : 'An unknown error occurred'
        );
      }
    };

  return (
    <div>
      <button
        onClick={generateTechnicalAssessmentQuestions}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Start Test
      </button>
    </div>
  );
};

export default TestGenerator;
