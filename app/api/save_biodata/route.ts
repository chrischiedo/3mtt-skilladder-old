import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server'
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // MongoDB connection string
const client = new MongoClient(uri as string);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const { userId } = await auth(); // Get the logged-in user's ID
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


        

        if (!data) {
          return NextResponse.json(
            { error: 'No data is passed' },
            { status: 400 }
          );
        }
       
        await client.connect();
        const db = client.db('myDatabase'); // Replace with your DB name
        const collection = db.collection('recipes'); // Replace with your collection name
    
        const res = await collection.updateOne(
          { user_id: userId },
          {
            $set: {
            'user_actions.biodata_completed': true,
             biodata: data
            },
          },
          { upsert: true } // Create the document if it doesn't exist
        );
    

        console.log(JSON.stringify(res, null, 2))
    

    // For now, we'll just return success
    return NextResponse.json({ 
      message: 'Biodata saved successfully',
      data: data 
    }, { status: 200 });

  } catch (error) {
    console.error('Error saving biodata:', error);
    return NextResponse.json({ 
      message: 'Failed to save biodata' 
    }, { status: 500 });
  }
} 