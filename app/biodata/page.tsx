import {SignedIn, SignedOut, SignInButton} from '@clerk/nextjs';
import BiodataForm from '../../components/BiodataForm';
import { auth } from '@clerk/nextjs/server';
import client from '../../lib/mongodb-connection';

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
        <BiodataForm data={userData?.biodata } />
      </SignedIn>
      <SignedOut>
        <SignInButton></SignInButton>
      </SignedOut>
    </div>
  );
}