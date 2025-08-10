 'use client';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const stepInstructions = {
  "Select Course": {
    title: "Course Selection Instructions",
    steps: [
      "Navigate to the course selection page",
      "Review the available 3MTT program tracks",
      "Click on your enrolled course track",
      "Confirm your selection"
    ]
  },
  "Upload Resume": {
    title: "Resume Upload Instructions",
    steps: [
      "Prepare your resume in PDF format",
      "Click the upload button",
      "Select your resume file",
      "Wait for the skills extraction to complete"
    ]
  },
  "Self Rating": {
    title: "Self Rating Instructions",
    steps: [
      "Review each extracted skill",
      "Rate your proficiency from 1-5",
      "Add any missing skills",
      "Submit your self-assessment"
    ]
  },
  "Technical Assessment": {
    title: "Technical Assessment Instructions",
    steps: [
     
      "Answer multiple-choice questions",
      "Answer open ended scenario questions",
      "Submit your assessment"
    ]
  },
  "Professional Capability": {
    title: "Professional Capability Instructions",
    steps: [
      "Complete the multiple choice and open ended questions",
      "Show your proficiency and profress through the assessment levels ",
      
    ]
  },
  "RAISEC Assessment": {
    title: "RIASEC Assessment Instructions",
    steps: [
      "Answer personality-based questions",
      "Review your career matches and clusters"
    ]
  }
};

export function InstructionsSheet({ currentStep, children }) {
  const instructions = stepInstructions[currentStep?.title] || stepInstructions["Select Course"];

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children ? children : <Button size="lg" variant="outline" className="w-full text-base">
          View Instructions
        </Button>}
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px] h-screen " side={"right"}>
        <SheetHeader>
          <SheetTitle>{instructions.title}</SheetTitle>
          <SheetDescription>
            Follow these steps to complete this section
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <ol className="space-y-4">
            {instructions.steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="font-bold text-blue-600">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </SheetContent>
    </Sheet>
  );
}