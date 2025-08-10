"use client"
import { usePDF, Document, Page } from '@react-pdf/renderer';
import { toast } from 'sonner';

// Import the styles and interfaces from your Resume component
//import Resume from './resume'; // You'll need to export the styles from Resume.tsx

interface DownloadResumeProps {
  data: any; // Use the same interface from Resume.tsx
  fileName?: string;
}

import {
    Text,
    View,
    StyleSheet,
    PDFViewer,
  } from '@react-pdf/renderer';
import Resume from './Resume';
import { Button } from '../ui/button';
  
  interface Education {
    type: string;
    startYear: string;
    endYear: string;
    notes: string;
  }
  
  interface WorkExperience {
    role: string;
    startDate: string;
    endDate: string;
    company: string;
    location: string;
    notes: string;
  }
  
  interface Project {
    name: string;
    description: string;
    technologies: string;
  }
  
  interface Certification {
    name: string;
    issuer: string;
    year: string;
  }
  
  interface TechnicalSkill {
    name: string;
  }
  
  interface ResumeData {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    lga?: string;
    state?: string;
    employmentStatus?: string;
    yearsOfExperience?: string;
    technicalSkills?: TechnicalSkill[];
    workExperienceHistory?: WorkExperience[];
    educationHistory?: Education[];
    certifications?: Certification[];
    projectExperience?: {
      hasProjects: boolean;
      projects: Project[];
    };
  }
  
  interface ResumeProps {
    data: ResumeData;
  }
  
  // Create styles
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontFamily: 'Helvetica',
    },
    section: {
      marginBottom: 20,
    },
    header: {
      marginBottom: 20,
      borderBottom: '1 solid #333',
      paddingBottom: 10,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    contactInfo: {
      fontSize: 10,
      color: '#666',
      marginBottom: 3,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
      borderBottom: '1 solid #ccc',
      paddingBottom: 3,
    },
    experienceItem: {
      marginBottom: 10,
    },
    jobTitle: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    company: {
      fontSize: 10,
      color: '#666',
    },
    dates: {
      fontSize: 10,
      color: '#666',
    },
    description: {
      fontSize: 10,
      marginTop: 5,
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 5,
    },
    skill: {
      fontSize: 10,
      backgroundColor: '#f0f0f0',
      padding: '3 8',
      borderRadius: 10,
    },
    projectTitle: {
      fontSize: 12,
      fontWeight: 'bold',
    },
  });
  
  const ResumePDF = ({ data }: ResumeProps) => {
    return (
    
        <Resume data={data}/>
     
    );
  };



const DownloadResume = ({ data, fileName = 'resume.pdf' }: DownloadResumeProps) => {

    
  
  const [instance, updateInstance] = usePDF({ document: <ResumePDF data={data} /> });

  if (instance.loading) return <div>Loading ...</div>;

  if (instance.error) return <div>Something went wrong: {instance.error}</div>;

  return (

    <Button size="lg" className="w-auto bg-blue-800 text-base">
       <a href={instance.url} download={fileName} >
      Download CV
    </a> 
    </Button>

    

  );
  
};

export default DownloadResume; 


