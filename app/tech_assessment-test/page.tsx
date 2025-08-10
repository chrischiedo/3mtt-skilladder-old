import { auth } from '@clerk/nextjs/server'
import client from '../../lib/mongodb-connection'
import {SignedIn} from '@clerk/nextjs'
import TechnicalAssessmentCard from '../../components/TechnicalAssessmentCardTest'

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
      <TechnicalAssessmentCard selectedCourse={findOneResult.selected_career} self_ratings={findOneResult.self_ratings_json}/>
      </SignedIn>
    </div>
  );
}