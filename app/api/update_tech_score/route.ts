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
    // Parse the form data
    const formData = await req.json();

    if (!formData) {
      return NextResponse.json(
        { error: 'No json is passed' },
        { status: 400 }
      );
    }

    const mcqScore = formData.mcqScore;
    const openScore = formData.openEndedScore;
    const scores = formData.scores; //score per week (Module)

    await client.connect();
    const db = client.db('myDatabase'); // Replace with your DB name
    const collection = db.collection('recipes'); // Replace with your collection name

    await collection.updateOne(
      { user_id: userId },
      {
        $set: {
          technical_score_mcq: mcqScore,
          technical_score_open: openScore,
          'user_actions.technical_assessment_taken': true,
          'technical_assessment_results.scores': scores,
        },
      },
      { upsert: false } // Create the document if it doesn't exist
    );

    return NextResponse.json({
      message: 'Technical Scores have been Updated',
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the request.' },
      { status: 500 }
    );
  }
};
