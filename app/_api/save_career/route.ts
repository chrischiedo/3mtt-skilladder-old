import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // MongoDB connection string
const client = new MongoClient(uri as string);

export async function POST(req: Request) {
  try {
    const { userId } = await auth(); // Get the logged-in user's ID
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { selectedCareer } = body;

    if (!selectedCareer) {
      return NextResponse.json({ error: 'Missing required field' }, { status: 400 });
    }

    await client.connect();
    const db = client.db('myDatabase'); // Replace with your DB name
    const collection = db.collection('recipes'); // Replace with your collection name

    await collection.updateOne(
      { user_id : userId },
      { $set: { selected_career: selectedCareer,
        'user_actions.selected_course': true
       } },
      { upsert: false } // Create the document if it doesn't exist
    );

    return NextResponse.json({ message: 'Career saved successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
}