'use client';
import React from 'react';

interface InstructionsProps {
  isLoading: boolean;
  onStartTest: () => void;
}

const Instructions: React.FC<InstructionsProps> = ({
  isLoading,
  onStartTest,
}) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Technical Assessment Instructions
      </h1>
      <p className="mb-4">
        This technical assessment is designed to evaluate your skills
        and competencies in your chosen career path. It includes both
        multiple-choice and open-ended questions to test your
        knowledge and problem-solving abilities.
      </p>
      <h2 className="text-lg font-semibold mb-2">
        Assessment Structure
      </h2>
      <ul className="list-disc pl-6 mb-4">
        <li>
          <strong>MCQ Questions:</strong> Choose the correct answer
          from the options provided.
        </li>
        <li>
          <strong>Open-ended Questions:</strong> Provide detailed
          responses to showcase your understanding and critical
          thinking.
        </li>
      </ul>
      <h2 className="text-lg font-semibold mb-2">How It Works</h2>
      <p className="mb-4">
        You will be presented with a set of questions. Your answers
        will be evaluated, and scores will be recorded for both MCQs
        and open-ended questions. Make sure to read the questions
        carefully and provide your best response.
      </p>

      <div className="text-center">
        <button
          onClick={onStartTest}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isLoading ? 'Loading Test...' : 'Start Assessment'}
        </button>
      </div>
    </div>
  );
};

export default Instructions;
