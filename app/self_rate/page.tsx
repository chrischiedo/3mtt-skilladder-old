import { auth } from '@clerk/nextjs/server'
import client from '../../lib/mongodb-connection'
import {SignedIn} from '@clerk/nextjs'
import SelfRatingCard from '../../components/SelfRatingCard'

export default async function Home() { 
  const { userId } = await auth();
  if (!userId) throw new Error('User not found');
  const findOneQuery = { user_id: userId };
  await client.connect();
  const dbName = "myDatabase";
  const collectionName = "recipes";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const findOneResult = await collection.findOne(findOneQuery);
  return (
    <div>
      <SignedIn>
      <SelfRatingCard topSkills={findOneResult.top_skills} otherSkills={findOneResult.skills_extracted} />
      </SignedIn>
    </div>
  );
}