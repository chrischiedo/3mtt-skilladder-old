'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import SkillsList from './SkillList';
import Link from 'next/link';
import PDFReport from './resume/PDFReport';
import { StepNavigation } from './StepNavigation';

export default function SkillExtractionForm({
  skills,
  selectedCareer,
}) {
  const router = useRouter();
  const [hasCV, setHasCV] = useState<null | boolean>(true);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showStepNavigation, setShowStepNavigation] = useState<boolean>(false);

  const handleManualChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    let apiData: FormData | Record<string, any>;

    if (hasCV) {
      if (!file) {
        setMessage('Please select a file to upload.');
        setLoading(false);
        return;
      }

      apiData = new FormData();
      apiData.append('file', file);
      apiData.append('inputType', 'cv');
    } else {
      const { name, email, skills } = formData;

      if (!name || !email || !skills) {
        setMessage('Please fill in all fields.');
        setLoading(false);
        return;
      }

      apiData = {
        name,
        email,
        skills,
        inputType: 'manual',
      };
    }

    try {
      const response = await fetch('/api/upload_resume/', {
        method: 'POST',
        body: hasCV ? apiData : JSON.stringify(apiData),
        headers: hasCV
          ? undefined
          : { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Data submitted successfully! ID: ' + data.id);
        toast.success('Data submitted successfully!');
        //router.push('/dashboard');
        setShowStepNavigation(true)
      } else {
        const errorData = await response.json();
        setMessage('Error: ' + errorData.error);
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while submitting the data.');
      toast.error('An error occurred while uploading the file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {hasCV === null ? (
        <div>
          <h1>Do you have a CV?</h1>
          <Button onClick={() => setHasCV(true)} className="mr-2">
            Yes
          </Button>
          <Button onClick={() => setHasCV(false)}>No</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h1>
            {hasCV ? 'Upload Your CV' : 'Enter Your Details Manually'}
          </h1>

          {hasCV ? (
            <>
              <Input
                type="file"
                name="uploadedFile"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept="application/pdf"
              />
            </>
          ) : (
            <>
              <Input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleManualChange}
                className="my-2"
              />
              <Input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleManualChange}
                className="my-2"
              />
              <Textarea
                name="skills"
                placeholder="List Your Skills (comma-separated)"
                value={formData.skills}
                onChange={handleManualChange}
                className="my-2"
              />
            </>
          )}

          <div className="w-full flex flex-row items-center justify-between space-x-3">
            <Button
              className="my-5 flex-1  bg-blue-500 text-white"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>

            {/* <Button
              onClick={() => setHasCV(null)}
              className=" bg-red-500 text-white"
            >
              Go Back
            </Button> */}
            <Link href="/dashboard">
              <Button className=" bg-red-500 text-white">
                Go Back
              </Button>
            </Link>
            {message && <p>{message}</p>}
          </div>
        </form>
      )}
      <p>You can add your skills manually if you do not have a resume</p>
      <div className="mt-6">
        <SkillsList skills={skills} selectedCareer={selectedCareer} />
      </div>
      <StepNavigation 
      title="Step completed" 
      subtitle='Congratulations! You have completed this step. The next step is a self evaluation of your selected skills.' 
      nextButtonHref='/self_rate' 
      isOpen={showStepNavigation}>
      </StepNavigation>
    </div>
  );
}

// 'use client';

// import { useState } from 'react';
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"

// export default function SkillExtractionForm() {
//     const [file, setFile] = useState<File | null>(null);
//     const [message, setMessage] = useState('');
//     const [loading, setLoading] = useState(false);

//     const handleSubmit = async (e: React.FormEvent) => {
//       e.preventDefault();
//       if (!file) {
//         setMessage('Please select a file to upload.');
//         return;
//       }
//       setLoading(true);
//       setMessage('');

//       const formData = new FormData();
//       formData.append('file', file);
//       console.log(formData);

//       try {
//         const response = await fetch('/api/upload_resume/', {
//           method: 'POST',
//           body: formData,
//         });
//         console.log(response);
//         if (response.ok) {
//           const data = await response.json();
//           console.log(data);
//           console.log(data["skills"]);
//           setMessage('Resume uploaded successfully! ID: ');
//         } else {
//           const errorData = await response.json();
//           setMessage('Error: ' + errorData.error);
//         }
//       } catch (error) {
//         console.error(error);
//         setMessage('An error occurred while uploading the file.');
//       } finally {
//         setLoading(false);
//       }
//     };
//   return (
//     <form onSubmit={handleSubmit}>
//         <h1>Upload Resume</h1>
//         <Input type="file"
//                name="uploadedFile"
//                onChange={(e) => setFile(e.target.files?.[0] || null)}
//                accept="application/pdf"/>
//         <Button className='my-5 w-[1000px] h-[50px]' type='submit' disabled = {loading}>{loading ? 'Saving...' : 'Submit'}</Button>
//     {message && <p>{message}</p>}
//     </form>
//   );
// }
