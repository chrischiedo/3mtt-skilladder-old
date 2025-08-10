import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // MongoDB connection string
const client = new MongoClient(uri as string);

export async function GET(req: Request) {
  try {
    const { userId } = await auth(); // Get the logged-in user's ID
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();

    await client.connect();
    const db = client.db('myDatabase'); // Replace with your DB name
    const collection = db.collection('recipes'); // Replace with your collection name

    // Aggregation pipeline
    const pipeline = [
      {
        $match: {
          fellow_id: { $regex: '^FE/' }, // Matches only fellows starting with "FE/"
        },
      },
      {
        $group: {
          _id: '$selected_career', // Group by selected_career
          totalNumberOfFellows: { $sum: 1 }, // Count matching records
        },
      },
    ];

    const results = await collection.aggregate(pipeline).toArray();

    console.log(results);

    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
