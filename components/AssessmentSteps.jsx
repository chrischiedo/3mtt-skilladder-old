// 'use client';
// import { CheckIcon, ImageIcon, StepForward } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';
// import { cn } from '@/lib/utils';
// import { Progress } from './ui/progress';
// import { InstructionsSheet } from './InstructionsSheet';
// import DownloadResume from './resume/DownloadResume';

// const paths = ['ds', 'ai', 'anim', 'cyber', 'pm', 'devops', 'qa', 'gd', 'sd', 'uiux', 'da', 'cc'];

// function getNextStep(actions) {
//   const {
//     selected_course,
//     biodata_completed,
//     skills_extracted,
//     self_rated,
//     technical_assessment_taken,
//     sfia_assessment_taken,
//     try_riasec,
//   } = actions || {};

//   if (selected_course) {
//     return {
//       title: "Select Course",
//       description: "Start by selecting your course track in the 3MTT program",
//       buttonHref: "/select_career",
//       buttonText: "Select Course"
//     };
//   }
//   if (!biodata_completed) {
//     return {
//       title: "Update Biodata",
//       description: "Update your personal information",
//       buttonHref: "/biodata",
//       buttonText: "Update"
//     };
//   }
  

//   if (!skills_extracted) {
//     return {
//       title: "Upload Resume",
//       description: "Add your resume to proceed with the assessment. This step is crucial for identifying your skills and strengths.",
//       buttonHref: "/skills_extraction",
//       buttonText: "Upload Resume"
//     };
//   }

//   if (!self_rated) {
//     return {
//       title: "Self Rating",
//       description: "Complete a self evaluation of the skills extracted from your resume",
//       buttonHref: "/self_rate",
//       buttonText: "Start Rating"
//     };
//   }

//   if (!technical_assessment_taken) {
//     return {
//       title: "Technical Assessment",
//       description: "Take a technical assessment to evaluate your practical skills",
//       buttonHref: "/tech_assessment",
//       buttonText: "Start Assessment"
//     };
//   }

//   if (!sfia_assessment_taken) {
//     return {
//       title: "Professional Capability",
//       description: "Take a short questionnaire to assess your professional skill level",
//       buttonHref: "/sfia_assessment",
//       buttonText: "Start Assessment"
//     };
//   }

//   if (!try_riasec) {
//     return {
//       title: "RAISEC Assessment",
//       description: "Answer questions to evaluate your preferred career paths",
//       buttonHref: "/try_raisec",
//       buttonText: "Start Assessment"
//     };
//   }

//   return {
//     title: "All Steps Completed!",
//     description: "You have completed all assessment steps. You can review or redo any step.",
//     buttonHref: "#",
//     buttonText: "View Results"
//   };
// }

// export function AssessmentSteps({ actions }) {
//   const {
//     biodata_completed,
//     selected_course,
//     skills_extracted,
//     self_rated,
//     technical_assessment_taken,
//     sfia_assessment_taken,
//     try_riasec,
//   } = actions || {};

//   const completedSteps = [
//     selected_course,
//     skills_extracted,
//     self_rated,
//     technical_assessment_taken,
//     sfia_assessment_taken,
//     try_riasec,
//   ].filter(Boolean).length;

//   const totalSteps = 6; // Total number of steps
//   const progressPercentage = (completedSteps / totalSteps) * 100;

//   const nextStep = getNextStep(actions);

//   return (
//     <div className="space-y-3">
//       <div className="border-2 border-dashed border-blue-400 py-3 px-4 rounded-lg">
//         <h1 className="text-xl font-bold mb-4">
//           Next Step
//         </h1>
//         <h2 className="text-base font-semibold text-muted-foreground">
//           {nextStep.description}
//         </h2>
//         <div className="flex flex-col justify-between items-center mt-4 space-y-3 ">
//           <Link href={nextStep.buttonHref}>
//             <Button size="lg" className="w-full bg-blue-800 text-base" >
//               {nextStep.buttonText}
//             </Button>
//           </Link>

//           <InstructionsSheet currentStep={nextStep} >
//           <Button size="lg" variant="outline" className="  text-base text">
//              View Instructions
//             </Button>
//           </InstructionsSheet>
//         </div>
//       </div>

      
//       <Step
//         title={'Select Course'}
//         subtitle={'Select course track taken in 3MTT program'}
//         buttonTitle={selected_course ? 'Update' : 'Select'}
//         buttonHref={
//           selected_course ? '/select_career' : '/select_career'
//         }
//         isCompleted={selected_course}
//         showButton={true}
//       />
//       <Step
//         title={'Update Biodata'}
//         subtitle={'Update your personal information'}
//         buttonTitle={selected_course ? 'Update' : 'Select'}
//         buttonHref={
//           selected_course ? '/biodata' : '/biodata'
//         }
//         isCompleted={biodata_completed}
//         showButton={selected_course }
//       />
//       <Step
//         title={'Add Skills'}
//         subtitle={'Analyse your skills by uploading your resume'}
//         buttonTitle={skills_extracted ? 'Update' : 'Start'}
//         buttonHref={
//           skills_extracted
//             ? '/skills_extraction'
//             : '/skills_extraction'
//         }
//         isCompleted={skills_extracted}
//         showButton={biodata_completed} //show button if previous step is completed
//       />
//       <Step
//         title={'Self Rating'}
//         subtitle={
//           'Do a self evaluation of the skills extracted from your resume'
//         }
//         buttonTitle={self_rated ? 'Redo' : 'Start'}
//         buttonHref={self_rated ? '/self_rate' : '/self_rate'}
//         isCompleted={self_rated}
//         showButton={selected_course && skills_extracted}
//       />
//       <Step
//         title={'Technical Assessment'}
//         subtitle={
//           'Do a self evaluation of the skills extracted from your resume'
//         }
//         buttonTitle={technical_assessment_taken ? 'Redo' : 'Start'}
//         buttonHref={
//           technical_assessment_taken
//             ? '/tech_assessment'
//             : '/tech_assessment'
//         }
//         isCompleted={technical_assessment_taken}
//         showButton={selected_course && skills_extracted && self_rated}
//       />
//       <Step
//         title={'Professional Capability'}
//         subtitle={
//           'Take a short  questionnaire to assess your skill level'
//         }
//         buttonTitle={sfia_assessment_taken ? 'Redo' : 'Start'}
//         buttonHref={
//           sfia_assessment_taken
//             ? '/sfia_assessment'
//             : '/sfia_assessment'
//         }
//         isCompleted={sfia_assessment_taken}
//         showButton={
//           selected_course &&
//           skills_extracted &&
//           self_rated &&
//           technical_assessment_taken
//         }
//       />
//       <Step
//         title={'RAISEC Assessment'}
//         subtitle={
//           'Answer some questions to evaluate your preferred career paths '
//         }
//         buttonTitle={try_riasec ? 'Redo' : 'Start'}
//         buttonHref={try_riasec ? '/try_raisec' : '/try_raisec'}
//         isCompleted={try_riasec}
//         showButton={
//           selected_course &&
//           skills_extracted &&
//           self_rated &&
//           technical_assessment_taken &&
//           sfia_assessment_taken
//         }
//       />

// <div className="flex flex-row justify-between items-center mb-4">
//         <Button
//           className="ml-4 rounded-full"
//           onClick={() => window.location.reload()}
//         >
//           Refresh
//         </Button>

       
//       </div>
      
//     </div>
//   );
// }

// function Step({
//   title,
//   subtitle,
//   buttonTitle,
//   buttonHref,
//   isCompleted,
//   showButton,
// }) {
//   return (
//     <div
//       className={cn(
//         'flex items-center justify-between p-3 bg-muted',
//         // isCompleted ? 'bg-green-100' : 'bg-muted',

//         'rounded-lg'
//       )}
//     >
//       <div className="flex items-center gap-4">
//         <div className="flex items-center justify-center w-12 h-12 p-2 rounded-full bg-white">
//           {isCompleted ? (
//             <CheckIcon className="w-8 h-8 text-green-500" />
//           ) : (
//             <StepForward className="w-8 h-8 text-muted-foreground" />
//           )}
//         </div>
//         <div className="space-y-1">
//           <h3 className="text-sm font-bold">{title}</h3>
//           <p className="text-sm text-muted-foreground max-w-md">
//             {subtitle}
//           </p>
//         </div>
//       </div>
//       {showButton && (
//         <Link href={buttonHref || '#'}>
//           <Button
//             variant="outline"
//             className={cn(
//               'text-primary border-blue-500 rounded-full',
//               !isCompleted && 'bg-blue-600 text-white'
//             )}
//           >
//             {buttonTitle}
//           </Button>
//         </Link>
//       )}
//     </div>
//   );
// }


// 'use client';
// import { CheckIcon, ImageIcon, StepForward } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';
// import { cn } from '@/lib/utils';
// import { Progress } from './ui/progress';
// import { InstructionsSheet } from './InstructionsSheet';
// import DownloadResume from './resume/DownloadResume';

// const paths = ['ds', 'ai', 'anim', 'cyber', 'pm', 'devops', 'qa', 'gd', 'sd', 'uiux', 'da', 'cc'];

// function getNextStep(actions) {
//   const {
//     selected_course: selected_path,
//     biodata_completed,
//     skills_extracted,
//     self_rated,
//     technical_assessment_taken,
//     sfia_assessment_taken,
//     try_riasec,
//   } = actions || {};

//   const selected_course = paths.some(path => path === selected_course)

//   if (!selected_course) {
//     return {
//       title: "Select Course",
//       description: "Start by selecting your course track in the 3MTT program",
//       buttonHref: "/select_career",
//       buttonText: "Select Course"
//     };
//   }
//   if (!biodata_completed) {
//     return {
//       title: "Update Biodata",
//       description: "Update your personal information",
//       buttonHref: "/biodata",
//       buttonText: "Update"
//     };
//   }
  

//   if (!skills_extracted) {
//     return {
//       title: "Upload Resume",
//       description: "Add your resume to proceed with the assessment. This step is crucial for identifying your skills and strengths.",
//       buttonHref: "/skills_extraction",
//       buttonText: "Upload Resume"
//     };
//   }

//   if (!self_rated) {
//     return {
//       title: "Self Rating",
//       description: "Complete a self evaluation of the skills extracted from your resume",
//       buttonHref: "/self_rate",
//       buttonText: "Start Rating"
//     };
//   }

//   if (!technical_assessment_taken) {
//     return {
//       title: "Technical Assessment",
//       description: "Take a technical assessment to evaluate your practical skills",
//       buttonHref: "/tech_assessment",
//       buttonText: "Start Assessment"
//     };
//   }

//   if (!sfia_assessment_taken) {
//     return {
//       title: "Professional Capability",
//       description: "Take a short questionnaire to assess your professional skill level",
//       buttonHref: "/sfia_assessment",
//       buttonText: "Start Assessment"
//     };
//   }

//   if (!try_riasec) {
//     return {
//       title: "RAISEC Assessment",
//       description: "Answer questions to evaluate your preferred career paths",
//       buttonHref: "/try_raisec",
//       buttonText: "Start Assessment"
//     };
//   }

//   return {
//     title: "All Steps Completed!",
//     description: "You have completed all assessment steps. You can review or redo any step.",
//     buttonHref: "#",
//     buttonText: "View Results"
//   };
// }

// export function AssessmentSteps({ actions }) {
//   const {
//     biodata_completed,
//     selected_course,
//     skills_extracted,
//     self_rated,
//     technical_assessment_taken,
//     sfia_assessment_taken,
//     try_riasec,
//   } = actions || {};

//   const completedSteps = [
//     selected_course,
//     skills_extracted,
//     self_rated,
//     technical_assessment_taken,
//     sfia_assessment_taken,
//     try_riasec,
//   ].filter(Boolean).length;

//   const totalSteps = 6; // Total number of steps
//   const progressPercentage = (completedSteps / totalSteps) * 100;

//   const nextStep = getNextStep(actions);

//   return (
//     <div className="space-y-3">
//       <div className="border-2 border-dashed border-blue-400 py-3 px-4 rounded-lg">
//         <h1 className="text-xl font-bold mb-4">
//           Next Step
//         </h1>
//         <h2 className="text-base font-semibold text-muted-foreground">
//           {nextStep.description}
//         </h2>
//         <div className="flex flex-col justify-between items-center mt-4 space-y-3 ">
//           <Link href={nextStep.buttonHref}>
//             <Button size="lg" className="w-full bg-blue-800 text-base" >
//               {nextStep.buttonText}
//             </Button>
//           </Link>

//           <InstructionsSheet currentStep={nextStep} >
//           <Button size="lg" variant="outline" className="  text-base text">
//              View Instructions
//             </Button>
//           </InstructionsSheet>
//         </div>
//       </div>

      
//       <Step
//         title={'Select Course'}
//         subtitle={'Select course track taken in 3MTT program'}
//         buttonTitle={selected_course ? 'Update' : 'Select'}
//         buttonHref={
//           selected_course ? '/select_career' : '/select_career'
//         }
//         isCompleted={selected_course}
//         showButton={true}
//       />
//       <Step
//         title={'Update Biodata'}
//         subtitle={'Update your personal information'}
//         buttonTitle={selected_course ? 'Update' : 'Select'}
//         buttonHref={
//           selected_course ? '/biodata' : '/biodata'
//         }
//         isCompleted={biodata_completed}
//         showButton={selected_course }
//       />
//       <Step
//         title={'Add Skills'}
//         subtitle={'Analyse your skills by uploading your resume'}
//         buttonTitle={skills_extracted ? 'Update' : 'Start'}
//         buttonHref={
//           skills_extracted
//             ? '/skills_extraction'
//             : '/skills_extraction'
//         }
//         isCompleted={skills_extracted}
//         showButton={biodata_completed} //show button if previous step is completed
//       />
//       <Step
//         title={'Self Rating'}
//         subtitle={
//           'Do a self evaluation of the skills extracted from your resume'
//         }
//         buttonTitle={self_rated ? 'Redo' : 'Start'}
//         buttonHref={self_rated ? '/self_rate' : '/self_rate'}
//         isCompleted={self_rated}
//         showButton={selected_course && skills_extracted}
//       />
//       <Step
//         title={'Technical Assessment'}
//         subtitle={
//           'Do a self evaluation of the skills extracted from your resume'
//         }
//         buttonTitle={technical_assessment_taken ? 'Redo' : 'Start'}
//         buttonHref={
//           technical_assessment_taken
//             ? '/tech_assessment'
//             : '/tech_assessment'
//         }
//         isCompleted={technical_assessment_taken}
//         showButton={selected_course && skills_extracted && self_rated}
//       />
//       <Step
//         title={'Professional Capability'}
//         subtitle={
//           'Take a short  questionnaire to assess your skill level'
//         }
//         buttonTitle={sfia_assessment_taken ? 'Redo' : 'Start'}
//         buttonHref={
//           sfia_assessment_taken
//             ? '/sfia_assessment'
//             : '/sfia_assessment'
//         }
//         isCompleted={sfia_assessment_taken}
//         showButton={
//           selected_course &&
//           skills_extracted &&
//           self_rated &&
//           technical_assessment_taken
//         }
//       />
//       <Step
//         title={'RAISEC Assessment'}
//         subtitle={
//           'Answer some questions to evaluate your preferred career paths '
//         }
//         buttonTitle={try_riasec ? 'Redo' : 'Start'}
//         buttonHref={try_riasec ? '/try_raisec' : '/try_raisec'}
//         isCompleted={try_riasec}
//         showButton={
//           selected_course &&
//           skills_extracted &&
//           self_rated &&
//           technical_assessment_taken &&
//           sfia_assessment_taken
//         }
//       />

// <div className="flex flex-row justify-between items-center mb-4">
//         <Button
//           className="ml-4 rounded-full"
//           onClick={() => window.location.reload()}
//         >
//           Refresh
//         </Button>

       
//       </div>
      
//     </div>
//   );
// }

// function Step({
//   title,
//   subtitle,
//   buttonTitle,
//   buttonHref,
//   isCompleted,
//   showButton,
// }) {
//   return (
//     <div
//       className={cn(
//         'flex items-center justify-between p-3 bg-muted',
//         // isCompleted ? 'bg-green-100' : 'bg-muted',

//         'rounded-lg'
//       )}
//     >
//       <div className="flex items-center gap-4">
//         <div className="flex items-center justify-center w-12 h-12 p-2 rounded-full bg-white">
//           {isCompleted ? (
//             <CheckIcon className="w-8 h-8 text-green-500" />
//           ) : (
//             <StepForward className="w-8 h-8 text-muted-foreground" />
//           )}
//         </div>
//         <div className="space-y-1">
//           <h3 className="text-sm font-bold">{title}</h3>
//           <p className="text-sm text-muted-foreground max-w-md">
//             {subtitle}
//           </p>
//         </div>
//       </div>
//       {showButton && (
//         <Link href={buttonHref || '#'}>
//           <Button
//             variant="outline"
//             className={cn(
//               'text-primary border-blue-500 rounded-full',
//               !isCompleted && 'bg-blue-600 text-white'
//             )}
//           >
//             {buttonTitle}
//           </Button>
//         </Link>
//       )}
//     </div>
//   );
// }


'use client';
import { CheckIcon, ImageIcon, StepForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';
import { InstructionsSheet } from './InstructionsSheet';
import DownloadResume from './resume/DownloadResume';



function getNextStep(actions, selectedCareer, cohort) {

  const paths = ['ds', 'ai', 'anim', 'cyber', 'pm', 'devops', 'qa', 'gd', 'sd', 'uiux', 'da', 'cc'];

  const {
    selected_course,
    biodata_completed,
    skills_extracted,
    self_rated,
    technical_assessment_taken,
    sfia_assessment_taken,
    try_riasec,
  } = actions || {};

  const course_selected = selectedCareer ? paths.some(path => path === selectedCareer) : false;

  if (!course_selected) {
    return {
      title: "Select Course",
      description: "Start by selecting your course track in the 3MTT program",
      buttonHref: "/select_career",
      buttonText: "Select Course"
    };
  }
  if (!biodata_completed) {
    return {
      title: "Update Biodata",
      description: "Update your personal information",
      buttonHref: "/biodata",
      buttonText: "Update"
    };
  }
  

  if (!skills_extracted) {
    return {
      title: "Upload Resume",
      description: "Add your resume to proceed with the assessment. This step is crucial for identifying your skills and strengths.",
      buttonHref: "/skills_extraction",
      buttonText: "Upload Resume"
    };
  }

  if (!self_rated) {
    return {
      title: "Self Rating",
      description: "Complete a self evaluation of the skills extracted from your resume",
      buttonHref: "/self_rate",
      buttonText: "Start Rating"
    };
  }

  if (!technical_assessment_taken) {
    return {
      title: "Technical Assessment",
      description: "Take a technical assessment to evaluate your practical skills",
      buttonHref: "/tech_assessment",
      buttonText: "Start Assessment"
    };
  }

  if (cohort != 'cohort_3' && !sfia_assessment_taken) {
    return {
      title: "Professional Capability",
      description: "Take a short questionnaire to assess your professional skill level",
      buttonHref: "/sfia_assessment",
      buttonText: "Start Assessment"
    };
  }

  if (!try_riasec) {
    return {
      title: "RAISEC Assessment",
      description: "Answer questions to evaluate your preferred career paths",
      buttonHref: "/try_raisec",
      buttonText: "Start Assessment"
    };
  }

  return {
    title: "All Steps Completed!",
    description: "You have completed all assessment steps. You can review or redo any step.",
    buttonHref: "#",
    buttonText: "View Results"
  };
}

export function AssessmentSteps({ actions, selectedCareer, cohort }) {
  const {
    biodata_completed,
    selected_course,
    skills_extracted,
    self_rated,
    technical_assessment_taken,
    sfia_assessment_taken,
    try_riasec,
  } = actions || {};

  const completedSteps = [
    selected_course,
    skills_extracted,
    self_rated,
    technical_assessment_taken,
    sfia_assessment_taken,
    try_riasec,
  ].filter(Boolean).length;

  const totalSteps = 6; // Total number of steps
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const nextStep = getNextStep(actions, selectedCareer, cohort);

  const paths = ['ds', 'ai', 'anim', 'cyber', 'pm', 'devops', 'qa', 'gd', 'sd', 'uiux', 'da', 'cc'];
  const course_selected = paths.some(path => path === selectedCareer)

  //const course_selected = selectedCareer.length >= 1

  return (
    <div className="space-y-3">
      
      <div className="border-2 border-dashed border-blue-400 py-3 px-4 rounded-lg">
        <h1 className="text-xl font-bold mb-4">
          Next Step
        </h1>
        <h2 className="text-base font-semibold text-muted-foreground">
          {nextStep.description}
        </h2>
        <div className="flex flex-col justify-between items-center mt-4 space-y-3 ">
          <Link href={nextStep.buttonHref}>
            <Button size="lg" className="w-full bg-blue-800 text-base" >
              {nextStep.buttonText}
            </Button>
          </Link>

          <InstructionsSheet currentStep={nextStep} >
          <Button size="lg" variant="outline" className="  text-base text">
             View Instructions
            </Button>
          </InstructionsSheet>
        </div>
      </div>

      {/* <pre>{JSON.stringify({course_selected, selectedCareer})}</pre> */}
      <Step
        title={'Select Course'}
        subtitle={'Select course track taken in 3MTT program'}
        buttonTitle={course_selected ? 'Update' : 'Select'}
        buttonHref={
          course_selected ? '/select_career' : '/select_career'
        }
        isCompleted={course_selected}
        showButton={true}
      />
      <Step
        title={'Update Biodata'}
        subtitle={'Update your personal information'}
        buttonTitle={biodata_completed ? 'Update' : 'Select'}
        buttonHref={
          course_selected ? '/biodata' : '/biodata'
        }
        isCompleted={biodata_completed}
        showButton={course_selected }
      />
      <Step
        title={'Add Skills'}
        subtitle={'Analyse your skills by uploading your resume'}
        buttonTitle={skills_extracted ? 'Update' : 'Start'}
        buttonHref={
          skills_extracted
            ? '/skills_extraction'
            : '/skills_extraction'
        }
        isCompleted={skills_extracted}
        showButton={biodata_completed} //show button if previous step is completed
      />
      <Step
        title={'Self Rating'}
        subtitle={
          'Do a self evaluation of the skills extracted from your resume'
        }
        buttonTitle={self_rated ? 'Redo' : 'Start'}
        buttonHref={self_rated ? '/self_rate' : '/self_rate'}
        isCompleted={self_rated}
        showButton={course_selected && skills_extracted }
      />
      <Step
        title={'Technical Assessment'}
        subtitle={
          'Do a self evaluation of the skills extracted from your resume'
        }
        buttonTitle={technical_assessment_taken ? 'Redo' : 'Start'}
        buttonHref={
          technical_assessment_taken
            ? '/tech_assessment'
            : '/tech_assessment'
        }
        isCompleted={technical_assessment_taken}
        showButton={course_selected && skills_extracted && self_rated}
      />
      {cohort != 'cohort_3' && <Step
        title={'Professional Capability'}
        subtitle={
          'Take a short  questionnaire to assess your skill level'
        }
        buttonTitle={sfia_assessment_taken ? 'Redo' : 'Start'}
        buttonHref={
          sfia_assessment_taken
            ? '/sfia_assessment'
            : '/sfia_assessment'
        }
        isCompleted={sfia_assessment_taken}
        showButton={
          course_selected &&
          skills_extracted &&
          self_rated &&
          technical_assessment_taken
        }
      />}
      <Step
        title={'RAISEC Assessment'}
        subtitle={
          'Answer some questions to evaluate your preferred career paths '
        }
        buttonTitle={try_riasec ? 'Redo' : 'Start'}
        buttonHref={try_riasec ? '/try_raisec' : '/try_raisec'}
        isCompleted={try_riasec}
        showButton={
          course_selected &&
          skills_extracted &&
          self_rated &&
          technical_assessment_taken
          // && sfia_assessment_taken
        }
      />

<div className="flex flex-row justify-between items-center mb-4">
        <Button
          className="ml-4 rounded-full"
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>

       
      </div>
      
    </div>
  );
}

function Step({
  title,
  subtitle,
  buttonTitle,
  buttonHref,
  isCompleted,
  showButton,
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-3 bg-muted',
        // isCompleted ? 'bg-green-100' : 'bg-muted',

        'rounded-lg'
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 p-2 rounded-full bg-white">
          {isCompleted ? (
            <CheckIcon className="w-8 h-8 text-green-500" />
          ) : (
            <StepForward className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {subtitle}
          </p>
        </div>
      </div>
      {showButton && (
        <Link href={buttonHref || '#'}>
          <Button
            variant="outline"
            className={cn(
              'text-primary border-blue-500 rounded-full',
              !isCompleted && 'bg-blue-600 text-white'
            )}
          >
            {buttonTitle}
          </Button>
        </Link>
      )}
    </div>
  );
}
