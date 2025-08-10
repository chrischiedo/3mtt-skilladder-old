import { Check } from 'lucide-react';

interface StepProps {
  number: number;
  title: string;
  subtitle: string;
  isCompleted: boolean;
  isActive: boolean;
}

export function Step({
  number,
  title,
  subtitle,
  ranking,
  isCompleted,
  isActive,
}: StepProps) {
  return (
    <div className="flex flex-col items-center text-center w-24">
      <div
        className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${
          isCompleted
            ? 'bg-blue-500'
            : isActive
            ? 'border-2 border-blue-500 text-blue-500'
            : 'border-2 border-gray-300 text-gray-300'
        }`}
      >
        {isCompleted ? (
          <Check className="w-4 h-4 text-white" />
        ) : (
          <span className="text-xs font-semibold">{number}</span>
        )}
      </div>
      <p
        className={`text-base font-medium  w-full ${
          isActive
            ? 'text-blue-500'
            : isCompleted
            ? 'text-gray-900'
            : 'text-gray-500'
        }`}
      >
        {title}
      </p>

      <p
        className={`text-base truncate w-full ${
          isCompleted || isActive ? 'text-gray-500' : 'text-gray-300'
        }`}
      >
        {subtitle}
      </p>
    </div>
  );
}
