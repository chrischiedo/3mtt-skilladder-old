'use client';
import { useState } from 'react';
import { StepIndicator } from './StepIndicator';
import sfiaData from '@/data/sfia.json';

const Stepper = ({
  step = 0,
  selectedCareer,
  active
}: {
  step: number;
  selectedCareer: string;
  active: boolean
}) => {
  const steps = sfiaData[selectedCareer].roles.map((role, index) => ({
    title: `Level ${index + 1}`,
    subtitle: `Step ${index + 1}`,
    ranking: role,
    level: index + 1,
  }));

  // [
  //   {
  //     title: 'Level 1',
  //     subtitle: 'Step 1',
  //     ranking: 'Basic understanding',
  //     level: 1,
  //   },
  //   {
  //     title: 'Level 2',
  //     subtitle: 'Step 2',
  //     ranking: 'Can Operate under supervision',
  //     level: 2,
  //   },
  //   {
  //     title: 'Level 3',
  //     subtitle: 'Step 3',
  //     ranking: 'Can Implement large projects',
  //     level: 3,
  //   },
  //   {
  //     title: 'Level 4',
  //     subtitle: 'Step 4',
  //     ranking: 'Can operate independently',
  //     level: 4,
  //   },
  //   {
  //     title: 'Level 5',
  //     subtitle: 'Step 5',
  //     ranking: 'Can lead',
  //     level: 5,
  //   },
  //   {
  //     title: 'Level 6',
  //     subtitle: 'Step 6',
  //     ranking: 'Managerial skills',
  //     level: 6,
  //   },
  //   {
  //     title: 'Level 7',
  //     subtitle: 'Step 7',
  //     ranking: 'Strategic skills',
  //     level: 7,
  //   },
  // ]
  const [currentStep, setCurrentStep] = useState(step);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        active={active}
        onNext={handleNext}
        onBack={handlePrev}
      />
    </div>
  );
};

export default Stepper;
