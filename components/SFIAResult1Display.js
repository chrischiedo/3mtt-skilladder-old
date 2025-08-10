
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from './ui/button';

export default function Result({ result }) {
  const router = useRouter();
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Career Recommendation
          </h1>
          {result.isRandom && (
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-4">
              <h2 className="text-lg font-semibold">Potential Random Responses Detected</h2>
              <ul className="list-disc list-inside text-sm">
                {Object.entries(result.reasons).map(([key, reason]) => (
                  <li key={key}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
          <ul className="divide-y divide-gray-200">
            {result.sortedCareerKeys.map((career, index) => (
              <li key={career} className="py-4 flex justify-between items-center">
                <span className="text-lg font-medium text-gray-700">{career}</span>
                <span className="text-lg font-semibold text-blue-600">
                  {result.sortedCareerConfidences[index].toFixed(2)}%
                </span>
              </li>
            ))}
          </ul>
        </div>

      <div className="mt-6 text-center">
        <Link href="/dashboard">
          <Button className="bg-blue-500 text-white px-4 py-2 rounded">
            Go to Dashboard
          </Button>
        </Link>
      </div>
      </div>
    );
  }
  