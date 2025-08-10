import React from 'react';
import UserDashboard from '../../components/FinalUserDashboardTest';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import client from '../../lib/mongodb-connection';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId)
    return (
      <div>
        <SignedOut>
          <Alert>
            <Terminal className="h-4 w-4 flex-auto flex-column" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              You should sign in to access this
            </AlertDescription>

            <SignInButton>
              <button className="my-10 px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-300 flex">
                Sign In
              </button>
            </SignInButton>
          </Alert>
        </SignedOut>
      </div>
    );

  const findOneQuery = { user_id: userId };
  await client.connect();
  const dbName = process.env.MONGODB_DATABASE || '';
  const collectionName = process.env.MONGODB_COLLECTION || '';

  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  try {
    const findOneResult = await collection.findOne(findOneQuery);

    if (findOneResult === null && userId !== null) {
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
          selected_career: null,
          skills_extracted: [],
        },
      ];
      try {
        const insertManyResult = await collection.insertMany(
          userFirstVisitData
        );
      } catch (err) {
        console.error(
          `Something went wrong trying to insert the new documents: ${err}\n`
        );
      }
    }
  } catch (err) {
    console.error(
      `Something went wrong trying to find one document: ${err}\n`
    );
  }
  //await client.close();

  const userData = await collection.findOne(findOneQuery);

  return (
    <div className="flex items-center justify-center">
      <SignedIn>
        <UserDashboard userData={userData} />
      </SignedIn>
      <SignedOut>
        <SignInButton></SignInButton>
      </SignedOut>
    </div>
  );
}
