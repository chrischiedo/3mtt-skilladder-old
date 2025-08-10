'use client';
import { useRouter } from 'next/navigation';
import { calculateBestCareer } from '../helpers/careerCalculation';

export default function Result() {
  const router = useRouter();
  const responses = JSON.parse(router.query.responses || '{}');
  const results = calculateBestCareer(responses);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Career Recommendation</h1>
      <ol>
        {results.map(([career, confidence]) => (
          <li key={career}>
            {career}: {confidence.toFixed(2)}%
          </li>
        ))}
      </ol>
    </div>
  );
}
