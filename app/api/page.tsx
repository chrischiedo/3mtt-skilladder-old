import { auth } from '@clerk/nextjs/server';
import client from '../../lib/mongodb-connection';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import TechnicalAssessmentCard from '../../components/TechnicalAssessmentCard';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import TechnicalDeepTechAssessmentCard from '@/components/TechnicalDeepTechAssessmentCard';

export default async function Home() {
  const { userId } = await auth();
  if (!userId)
    return (
      <div>
        <SignedOut>
          <Alert>
            <Terminal className="h-4 w-4 flex-auto flex-column" />
            <AlertTitle>Signin required</AlertTitle>
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
  const dbName = 'myDatabase';
  const collectionName = 'recipes';
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const findOneResult = await collection.findOne(findOneQuery);
  return (
    <div>
      <SignedIn>
        {findOneResult?.cohort === 'deeptech' && (
          <TechnicalDeepTechAssessmentCard
            cohort={findOneResult?.cohort}
            selected_career={findOneResult?.selected_career}
            self_ratings={findOneResult?.self_ratings_json}
          />
        )}

        {findOneResult?.cohort !== 'deeptech' &&
          findOneResult?.cohort !== null && (
            <TechnicalAssessmentCard
              cohort={findOneResult?.cohort}
              selected_career={findOneResult?.selected_career}
              self_ratings={findOneResult?.self_ratings_json}
            />
          )}
      </SignedIn>
    </div>
  );
}
