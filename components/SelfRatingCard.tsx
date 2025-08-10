'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Loader } from 'lucide-react';
import { StepNavigation } from './StepNavigation';

const SkillRating = ({ topSkills, otherSkills }: { topSkills: { skill: string }[]; otherSkills: { skill: string }[] }) => {
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const router = useRouter();
  const handleRatingChange = (skill: string, value: number) => {
    setRatings((prev) => ({ ...prev, [skill]: value }));
  };
  const [loading, setLoading] = useState(false);
  const [showStepNavigation, setShowStepNavigation] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true

    try {
      const response = await fetch('/api/upload_self_rate_skills/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ratings }),
      });

      if (response.ok) {
        toast.success('Self Ratings successfully saved!');
        //router.push('/dashboard');
        setShowStepNavigation(true)
      } else {
        throw new Error('Failed to save the career.');
      }
    } catch (error) {
      console.error(error);
      //alert('An error occurred. Please try again.');
      toast.error('An error occurred while uploading the file.');
    } finally {
      setLoading(false); // Set loading to false after the operation
    }
  };

  return (
    <div className="space-y-8">
      {/* Section for Top Skills */}
      <section>
        <h2 className="text-xl font-bold mb-4">Rate Your Top Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topSkills?.map(({ skill }) => (
            <div key={skill} className="p-4 border rounded-md shadow">
              <h3 className="text-lg font-medium">{skill}</h3>
              <input
                type="range"
                min="1"
                max="5"
                value={ratings[skill] || 1}
                onChange={(e) => handleRatingChange(skill, Number(e.target.value))}
                className="w-full mt-2"
              />
              <p className="mt-1 text-sm">Rating: {ratings[skill] || 1}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section for Other Skills */}
      <section>
        <h2 className="text-xl font-bold mb-4">Rate Your Other Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherSkills?.map(({ skill }) => (
            <div key={skill} className="p-4 border rounded-md shadow">
              <h3 className="text-lg font-medium">{skill}</h3>
              <input
                type="range"
                min="1"
                max="5"
                value={ratings[skill] || 1}
                onChange={(e) => handleRatingChange(skill, Number(e.target.value))}
                className="w-full mt-2"
              />
              <p className="mt-1 text-sm">Rating: {ratings[skill] || 1}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="relative">
        {/* {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader className="animate-spin h-5 w-5 text-blue-500" />
          </div>
        )} */}
        <Button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md w-full"
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <>
              <Loader className="animate-spin h-5 w-5 text-white" />
              <span className="ml-2">Loading...</span>
            </>
          ) : (
            'Submit Ratings'
          )}
        </Button>
      </div>
      <StepNavigation
      title="Step completed" 
      subtitle='Congratulations! You have completed this step. The next step is to take the technical evaluation to measure your current proficiency.' 
      nextButtonHref='/tech_assessment' 
      isOpen={showStepNavigation}>
      </StepNavigation>
    </div>
  );
};

export default SkillRating;
