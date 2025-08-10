'use client';
import React from 'react';

const TimeUpDialog: React.FC = () => {
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

export default TimeUpDialog;
