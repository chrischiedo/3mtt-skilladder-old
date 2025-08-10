import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // MongoDB connection string
const client = new MongoClient(uri as string);

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth(); // Get the logged-in user's ID
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    // Parse the body data
    const body = await req.json();
    const { skills } = body;

    await client.connect();
    const db = client.db('myDatabase'); // Replace with your DB name
    const collection = db.collection('recipes'); // Replace with your collection name

    await collection.updateOne(
      { user_id: userId },
      {
        $set: {
          skills_extracted: skills,
          'user_actions.skills_extracted': true,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      message: 'Skills updated successfully!',
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the request.' },
      { status: 500 }
    );
  }
};
