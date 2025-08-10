import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server'
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // MongoDB connection string
const client = new MongoClient(uri as string);

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth(); // Get the logged-in user's ID
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { results } = body;

    if (!results) {
      return NextResponse.json({ error: 'Missing ratings' }, { status: 400 });
    }

    await client.connect();
    const db = client.db('myDatabase'); // Replace with your DB name
    const collection = db.collection('recipes'); // Replace with your collection name

    await collection.updateOne(
      { user_id : userId },
      { $set: { sfia1_results: results,
        'user_actions.sfia_assessment_taken': true
       }},
      { upsert: false } // Create the document if it doesn't exist
    );
    
    return NextResponse.json({
      message: 'Self Ratings have been Saved Successfully!!'
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the file.' },
      { status: 500 }
    );
  }
};