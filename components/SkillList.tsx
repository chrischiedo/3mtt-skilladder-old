'use client';

import { useState } from 'react';
import { Check, Loader, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import allSkills from '@/data/skills.json';
import { toast } from 'sonner';
import PDFReport from './resume/PDFReport';
import { useRouter } from 'next/navigation';
import { StepNavigation } from './StepNavigation';

// Define the skill interface
interface Skill {
  skill: string;
}

export default function SkillsList({
  skills: mySkills,
  selectedCareer,
}: {
  skills: Skill[];
  selectedCareer: string;
}) {
  const router = useRouter()
  const careerSkills = allSkills[selectedCareer]?.map((i) => i.skill) || [];
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [skills, setSkills] = useState<Skill[]>(mySkills);
  const [customSkill, setCustomSkill] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [showStepNavigation, setShowStepNavigation] = useState<boolean>(false);

  const addSkill = () => {
    const skillToAdd = customSkill || selectedSkill; // Use custom input if available
    if (skillToAdd && !skills.some((s) => s.skill === skillToAdd)) {
      setSkills([...skills, { skill: skillToAdd }]);
      setSelectedSkill('');
      setCustomSkill(''); // Clear custom input after adding
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s.skill !== skillToRemove));
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomSkill(event.target.value); // Update custom skill input
  };

  const saveSkills = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/update_skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ skills }),
      });

      if (!response.ok) {
        throw new Error('Failed to save skills');
      }

      toast.success('Your skills have been saved successfully.');
      //router.push('/dashboard')
      setShowStepNavigation(true)
    } catch (error) {
      console.error('Error saving skills:', error);
      toast('Failed to save skills. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="container  max-w-md lg:max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">My Skills</h2>
        <div className="flex flex-col lg:flex-row gap-4">
          {careerSkills.length > 0 && (
            <Select
              value={selectedSkill}
              onValueChange={setSelectedSkill}
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a skill to add" />
              </SelectTrigger>
              <SelectContent>
                {careerSkills
                  .filter(
                    (skill) => !skills.some((s) => s.skill === skill)
                  )
                  .map((skill, index) => (
                    <SelectItem key={skill + index} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
          <input
            type="text"
            value={customSkill}
            onChange={handleInputChange}
            placeholder="or enter a skill"
            className="border rounded p-2"
          />
          <Button
            onClick={addSkill}
            disabled={!selectedSkill && !customSkill}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Skill
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map(({ skill }) => (
          <div
            key={skill}
            className="flex items-center justify-between p-4 rounded-lg border bg-card"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium">{skill}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeSkill(skill)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove {skill}</span>
            </Button>
          </div>
        ))}

        {skills.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground p-4">
            No skills added yet. Use the dropdown above to add your
            skills.
          </div>
        )}
      </div>

      <div className="mt-6">
        <Button
          onClick={saveSkills}
          className="w-full py-4"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader className="animate-spin mr-2"></Loader>
              Saving...
            </>
          ) : (
            'Save Skills'
          )}
        </Button>
      </div>
      <StepNavigation 
      title="Step completed" 
      subtitle='Congratulations! You have completed this step. The next step is a self evaluation of your selected skills.' 
      nextButtonHref='/self_rate' 
      isOpen={showStepNavigation}>
      </StepNavigation>
    </Card>
  );
}
