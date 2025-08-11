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
import { MoveRight, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { SectionBlock } from '@/components/blocks/section-block';

export default async function Home() {
  const { userId } = await auth();

  const findOneQuery = { user_id: userId };
  await client.connect();
  const dbName = 'myDatabase';
  const collectionName = 'recipes';

  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  try {
    const findOneResult = await collection.findOne(findOneQuery);
   
    if (findOneResult === null && userId !== null) {
      console.log(`Creating the User.. : ${userId}`);

      const userFirstVisitData = [
        {
          user_id: userId,
          user_actions: {
            selected_course: false,
            skills_extracted: false,
            self_rated: false,
            technical_assessment_taken: false,
            sfia_assessment_taken: false,
            try_riasec: false,
          },
        },
      ];
      try {
        const insertManyResult = await collection.insertMany(
          userFirstVisitData
        );
        console.log(
          `${insertManyResult.insertedCount} documents successfully inserted.\n`
        );
      } catch (err) {
        console.error(
          `Something went wrong trying to insert the new documents: ${err}\n`
        );
      }
    } else {
      console.log(
        `Found the user with id  ${userId}\n`
      );
    }
  } catch (err) {
    console.error(
      `Something went wrong trying to find one document: ${err}\n`
    );
  }
  //await client.close();
  return (
    <div>
      <div className="w-full relative max-h-[80vh]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/bg-image.png"
            alt="Hero background"
            fill
            priority
            className="object-cover"
            quality={100}
          />
          <div className="absolute inset-0 bg-gray-700/50" />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="flex gap-8 py-8 xl:py-20 px-12 md:px-20 lg:py-40 items-center justify-center flex-col">
            <div className="flex gap-4 pt-16  flex-col">
              <h1 className="text-5xl font-bold md:text-7xl max-w-2xl tracking-tighter text-center font-regular text-white">
                Evaluate Your Tech Skills
              </h1>
              <p className="text-lg md:text-xl font-medium leading-relaxed tracking-tight text-white max-w-2xl text-center">
                As a 3MTT fellow, you've completed your chosen track's
                curriculum. Now, take the next step with our
                comprehensive skill assessment program. This assessment
                is designed to evaluate your skills, identify areas
                for growth, and provide personalized recommendations
                for further development. Complete the assessment to unlock
                your full potential and excel in your career.
              </p>
            </div>
            <div className="flex flex-col lg:flex-row gap-3 pb-16">
              <Link href="/instructions">
                <Button
                  size="lg"
                  className="gap-4 text-lg"
                  variant="outline"
                >
                  View Instructions
                </Button>
              </Link>
              <SignedOut>
                <SignInButton>
                  <Button
                    size="lg"
                    className="gap-4 text-lg bg-blue-800 text-white"
                  >
                    Sign In <MoveRight className="w-4 h-4" />
                  </Button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <div>
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="gap-4 text-lg bg-blue-800 text-white"
                    >
                      Go to dashboard
                    </Button>
                  </Link>
                </div>
              </SignedIn>

              {/* <SignedOut>
              <SignInButton>
                <Button className="w-full my-10 px-6 py-6 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-300 flex justify-center text-xl mx-auto max-w-[300px] lg:max-w-[300px]">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut> */}

              {/* <SignedIn>
              <div>
                <Link href="/dashboard">
                  <Button className="w-full my-10 px-6 py-6 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-300 flex justify-center text-xl mx-auto max-w-[300px] lg:max-w-[300px]">
                    Go to dashboardd
                  </Button>
                </Link>
              </div>
            </SignedIn> */}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <SectionBlock />
      </div>
    </div>
  );
}