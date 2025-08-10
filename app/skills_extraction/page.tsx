import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import SkillExtractionForm from '../../components/SkillsExtractionForm';
import { auth } from '@clerk/nextjs/server';
import client from '../../lib/mongodb-connection';
import PDFReport from '@/components/resume/PDFReport';

export default async function Home() {
  const { userId } = await auth();
  const findOneQuery = { user_id: userId };
  await client.connect();
  const dbName = 'myDatabase';
  const collectionName = 'recipes';

  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const userData = await collection.findOne(findOneQuery);

  return (
    <div className="flex items-center justify-center">
      <SignedIn>
        <SkillExtractionForm
          data={userData}
          skills={userData?.skills_extracted || []}
          selectedCareer={userData?.selected_career}
        />
      </SignedIn>
      <SignedOut>
        <SignInButton></SignInButton>
      </SignedOut>
      {/* <PDFReport data={userData} /> */}
    </div>
  );
}
