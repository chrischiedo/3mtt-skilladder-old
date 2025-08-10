'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function TryRaiseC() {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const router = useRouter();

  const rules = [
    '1. The assessment consists of multiple-choice questions.',
    '2. You cannot go back to a previous question once answered.',
    '3. You have a limited amount of time for the entire test.',
    '4. Do not refresh or leave the page during the test.',
    '5. Stay focused and answer all questions honestly.',
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(
        () => setCountdown((prev) => (prev ? prev - 1 : 0)),
        1000
      );
    } else if (countdown === 0) {
      router.push('/raisec_assessment');
    }
    return () => clearTimeout(timer);
  }, [countdown, router]);

  const handleStart = () => {
    setIsCountdownActive(true);
    setCountdown(20);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome to the RAISEC Assessment</h1>
      <p>
        Please review the following rules carefully before beginning
        the test:
      </p>
      <ul style={{ marginBottom: '20px' }}>
        {rules.map((rule, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            {rule}
          </li>
        ))}
      </ul>

      {isCountdownActive ? (
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'red',
            }}
          >
            Test will begin in: {countdown} seconds
          </p>
        </div>
      ) : (
        <button
          onClick={handleStart}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Start Test
        </button>
      )}
    </div>
  );
}
