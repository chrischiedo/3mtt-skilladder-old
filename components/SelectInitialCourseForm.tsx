'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { redirectTo } from '@/app/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import PDFReport from './resume/PDFReport';
import { StepNavigation } from './StepNavigation';

export default function CareerForm() {
  const router = useRouter();
  const [selectedCohort, setSelectedCohort] = useState('');
  const [selectedCareer, setSelectedCareer] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showStepNavigation, setShowStepNavigation] =
    useState<boolean>(false);
  const [fellowId, setFellowId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');

    if (!fellowId || !selectedCohort || !selectedCareer) {
      toast.error('Missing required fields');
      return;
    }

    try {
      const response = await fetch('/api/save_career/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedCareer,
          selectedCohort,
          fellowId,
        }),
      });

      if (response.ok) {
        setSuccessMessage('Career successfully saved!');

        if (
          typeof window !== 'undefined' &&
          localStorage.getItem('assessmentSession')
        ) {
          localStorage.removeItem('assessmentSession');
        }
        toast.success('Career successfully saved');
        setShowStepNavigation(true);
      } else {
        throw new Error('Failed to save the career.');
        toast.error('Failed to save the career.');
      }
    } catch (error) {
      console.error(error);
      // alert('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label
            htmlFor="fellowId"
            className="block text-sm font-medium text-gray-700"
          >
            Fellow ID:
          </label>
          <input
            type="text"
            name="fellowId"
            value={fellowId}
            onChange={(e) => setFellowId(e.target.value)}
            id="fellowId"
            className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your fellow ID"
          />
        </div>
        <Select
          onValueChange={setSelectedCohort}
          value={selectedCohort}
        >
          <SelectTrigger className="w-[400px] lg:w-[1000px] h-[50px] px-4 mb-5">
            <SelectValue placeholder="Select Cohort:" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Careers</SelectLabel>
              <SelectItem value="cohort_2">Cohort 2</SelectItem>
              <SelectItem value="cohort_3">
                Cohort 3 (waitlist)
              </SelectItem>
              <SelectItem value="deeptech">DeepTech_Ready</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          onValueChange={setSelectedCareer}
          value={selectedCareer}
          disabled={!selectedCohort}
        >
          <SelectTrigger className="w-[400px] lg:w-[1000px] h-[50px] px-4">
            <SelectValue placeholder="Select 3MTT Course Track:" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Careers</SelectLabel>
              {selectedCohort === 'deeptech' ? (
                <>
                  <SelectItem value="ds">Data Science</SelectItem>
                 
                  <SelectItem value="da">
                    Data Analysis and Visualization
                  </SelectItem>
                  <SelectItem value="ai">AI and ML</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="ds">Data Science</SelectItem>
                  <SelectItem value="sd">
                    Software Development
                  </SelectItem>
                  <SelectItem value="da">
                    Data Analysis and Visualization
                  </SelectItem>
                  <SelectItem value="ai">AI and ML</SelectItem>
                  <SelectItem value="pm">
                    Product Management
                  </SelectItem>
                  <SelectItem value="gd">Game Developmemt</SelectItem>
                  <SelectItem value="uiux">
                    UI UX Development
                  </SelectItem>
                  <SelectItem value="cc">Cloud Computing</SelectItem>
                  <SelectItem value="anim">Animation</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                  <SelectItem value="qa">
                    Quality Assurance
                  </SelectItem>
                  <SelectItem value="cyber">CyberSecurity</SelectItem>
                </>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          className="my-5 w-full  h-[50px]"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Submit'}
        </Button>
        {successMessage && <p>{successMessage}</p>}
      </form>
      <StepNavigation
        title="Course track selected"
        subtitle="Course track selected. Please proceed to the next step to update your biodata information."
        nextButtonHref="/biodata"
        isOpen={showStepNavigation}
      ></StepNavigation>
    </>
  );
}
