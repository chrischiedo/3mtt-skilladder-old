import { auth } from '@clerk/nextjs/server';
import client from '../../lib/mongodb-connection';
import { SignedIn } from '@clerk/nextjs';
import AssessmentPage from '../../components/sfiaAssessmentPage';

export default async function Home() {
  const { userId } = await auth();
  if (!userId) throw new Error('User not found');

  const findOneQuery = { user_id: userId };
  await client.connect();
  const dbName = 'myDatabase';
  const collectionName = 'recipes';

  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const userData = await collection.findOne(findOneQuery);

  return (
    <div>
      <SignedIn>
        {userData?.selected_career ? (
          <AssessmentPage
            cohort={userData?.cohort}
            selectedCareer={userData?.selected_career}
            currentSfiaLevel={userData?.sfia_level_max}
          />
        ) : (
          <p>Career not selected</p>
        )}
      </SignedIn>
    </div>
  );
}
