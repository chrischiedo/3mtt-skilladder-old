import { Step } from './Step';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';

interface StepData {
  title: string;
  subtitle: string;
}

interface StepIndicatorProps {
  steps: StepData[];
  currentStep: number;
  active: boolean;
  onNext: () => void;
  onBack: () => void;
}

export function StepIndicator({
  steps,
  currentStep,
  active,
  onNext,
  onBack,
}: StepIndicatorProps) {
  const activeStepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeStepRef.current) {
      activeStepRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentStep]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <ScrollArea className="w-full whitespace-nowrap rounded-md border-none">
        <div className="flex items-center p-4 space-x-10">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div ref={index === currentStep ? activeStepRef : null}>
                <Step
                  number={index + 1}
                  title={step.title}
                  subtitle={step.subtitle}
                  isCompleted={index < currentStep}
                  isActive={index === currentStep}
                />
              </div>
              {index < steps.length - 1 && (
                <div className="w-16 h-0.5 mx-2 bg-gray-200">
                  <div
                    className={`h-full ${
                      index < currentStep
                        ? 'bg-blue-500'
                        : 'bg-gray-200'
                    }`}
                    style={{
                      width: `${index < currentStep ? 100 : 0}%`,
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="text-center my-8">
        {currentStep >= 1 && (
          <p className="text-2xl font-bold ">
            <span className="font-normal">Skill level:</span>{' '}
            {steps[currentStep - 1]?.ranking}
          </p>
        )}

        {/* {currentStep == 7 && (
          <p className="text-2xl font-bold ">
            <span className="font-normal">Skill level:</span>{' '}
            {steps[currentStep - 1]?.ranking}
          </p>
        )} */}
        <p></p>

        {steps[currentStep]?.level <= 6 && (
          <>
            <h2 className="text-base font-semibold">
              Next Level: {steps[currentStep].title}
            </h2>
            {active && (
              <Link href={`/sfia_assessment`}>
                <Button variant="default" className="mt-4">
                  Take Assessment
                </Button>
              </Link>
            )}
          </>
        )}
      </div>
      {/* <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        <Button
          variant={'secondary'}
          onClick={onNext}
          disabled={currentStep === steps.length - 1}
        >
          {currentStep === steps.length - 1 ? 'Finish' : 'Next step'}
        </Button>
      </div> */}
    </div>
  );
}
