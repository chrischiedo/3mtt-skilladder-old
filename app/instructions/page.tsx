

'use server';
import { auth } from '@clerk/nextjs/server';
import client from '../lib/mongodb-connection';
import { SignedIn, SignInButton, SignedOut } from '@clerk/nextjs';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Lightbulb,
  Search,
  PenTool,
  Layers,
  Zap,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Home() {
  const { userId } = await auth();

  if (!userId)
    return (
      <div>
        <SignedOut>
          <PageContent />
          <div>
            <SignInButton>
              <Button className="w-full my-10 px-6 py-6 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-300 flex justify-center text-xl mx-auto max-w-[300px] lg:max-w-[300px]">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </SignedOut>

        
      </div>
    );



  return (
    <div>
     
        <PageContent />
        <div>
        <SignedIn>
          <Link href="/dashboard">
            <Button className="w-full my-10 px-6 py-6 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-300 flex justify-center text-xl mx-auto max-w-[300px] lg:max-w-[300px]">
              Go to dashboard
            </Button>
          </Link>
          </SignedIn>
        </div>
     
    </div>
  );
}

export async function PageContent({children}) {
  const steps = [
    {
      icon: Lightbulb,
      title: 'Course Selection',
      description:
        'It begins with you. The first step is you selecting the course you took in the 3MTT track. .',
    },
    {
      icon: Search,
      title: 'Skill Extraction',
      description:
        'Submit your resume, and our system will intelligently extract and highlight the skills listed in your CV, ',
    },
    {
      icon: PenTool,
      title: 'Self Rating',
      description:
        'Evaluate your proficiency in each skill highlighted from your resume to identify areas for improvement and growth.',
    },
    {
      icon: Layers,
      title: 'Technical Assessment',
      description:
        'Take a comprehensive technical assessment to effectively validate your self-rating.',
    },
    {
      icon: Zap,
      title: 'Professional Capability',
      description:
        'The professional capability assessment evaluates your skills and competencies in various IT roles. ',
    },
    {
      icon: CheckCircle,
      title: 'RIASEC Assessment',
      description:
        'The RIASEC assessment helps you identify your interests and strengths across six key areas: ',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col lg:flex-row lg:justify-between">
        <div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-700 via-blue-300 to-blue-600 text-transparent bg-clip-text">
            Skill Assessment
          </h1>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-muted-foreground mb-12">
            Follow these steps for success
          </h2>
        </div>

        {children}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <Card
            key={index}
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-400 to-blue-700 p-3 rounded-full">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">
                  {step.title}
                </h3>
              </div>
              <p className="text-muted-foreground">
                {step.description}
              </p>
              <div className="flex items-center space-x-2 text-sm font-medium text-blue-500">
                <span>Step {index + 1}</span>
                <span>&rarr;</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
