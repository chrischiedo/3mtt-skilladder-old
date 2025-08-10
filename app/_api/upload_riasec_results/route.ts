import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // MongoDB connection string
const client = new MongoClient(uri as string);

// Mock career clusters for demonstration purposes
const careerClusters = {
  R: ['Automotive', 'Engineering', 'Construction'],
  I: ['Scientist', 'Analyst', 'Researcher'],
  A: ['Artist', 'Designer', 'Performer'],
  S: ['Social Worker', 'Teacher', 'Counselor'],
  E: ['Sales', 'Marketing', 'Management'],
  C: ['Accountant', 'Administrator', 'Clerk'],
};

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth(); // Get the logged-in user's ID
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { results } = body;

    if (!results) {
      return NextResponse.json(
        { error: 'Missing raisec results' },
        { status: 400 }
      );
    }

    // Load questions (assumes questions are available server-side)
    const questions = [
      {
        question: 'I like to work on cars',
        category: 'R',
      },
      {
        question: 'I like to do puzzles',
        category: 'I',
      },
      {
        question: 'I am good at working independently',
        category: 'A',
      },
      {
        question: 'I like to work in teams',
        category: 'S',
      },
      {
        question: 'I am an ambitious person, I set goals for myself',
        category: 'E',
      },
      {
        question: 'I like to organize things (files, desks/offices)',
        category: 'C',
      },
      {
        question: 'I like to build things',
        category: 'R',
      },
      {
        question: 'I like to read about art and music',
        category: 'A',
      },
      {
        question: 'I like to have clear instructions to follow',
        category: 'C',
      },
      {
        question: 'I like to try to influence or persuade people',
        category: 'E',
      },
      {
        question: 'I like to do experiments',
        category: 'I',
      },
      {
        question: 'I like to teach or train people',
        category: 'S',
      },
      {
        question: 'I like trying to help people solve their problems',
        category: 'S',
      },
      {
        question: 'I like to take care of animals',
        category: 'R',
      },
      {
        question:
          "I wouldn't mind working 8 hours per day in an office",
        category: 'C',
      },
      {
        question: 'I like selling things',
        category: 'E',
      },
      {
        question: 'I enjoy creative writing',
        category: 'A',
      },
      {
        question: 'I enjoy science',
        category: 'I',
      },
      {
        question: 'I am quick to take on new responsibilities',
        category: 'E',
      },
      {
        question: 'I am interested in healing people',
        category: 'S',
      },
      {
        question: 'I enjoy trying to figure out how things work',
        category: 'I',
      },
      {
        question:
          'I like putting things together or assembling things',
        category: 'R',
      },
      {
        question: 'I am a creative person',
        category: 'A',
      },
      {
        question: 'I pay attention to details',
        category: 'C',
      },
      {
        question: 'I like to do filing or typing',
        category: 'C',
      },
      {
        question: 'I like to analyze things (problems/situations)',
        category: 'I',
      },
      {
        question: 'I like to play instruments or sing',
        category: 'A',
      },
      {
        question: 'I enjoy learning about other cultures',
        category: 'S',
      },
      {
        question: 'I would like to start my own business',
        category: 'E',
      },
      {
        question: 'I like to cook',
        category: 'R',
      },
      {
        question: 'I like acting in plays',
        category: 'A',
      },
      {
        question: 'I am a practical person',
        category: 'R',
      },
      {
        question: 'I like working with numbers or charts',
        category: 'C',
      },
      {
        question: 'I like to get into discussions about issues',
        category: 'E',
      },
      {
        question: 'I am good at keeping records of my work',
        category: 'C',
      },
      {
        question: 'I like to lead',
        category: 'E',
      },
      {
        question: 'I like working outdoors',
        category: 'R',
      },
      {
        question: 'I would like to work in an office',
        category: 'C',
      },
      {
        question: 'I\u2019m good at math',
        category: 'C',
      },
      {
        question: 'I like helping people',
        category: 'S',
      },
      {
        question: 'I like to draw',
        category: 'A',
      },
      {
        question: 'I like to give speeches',
        category: 'E',
      },
    ];

    // Compute RIASEC scores
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    questions.forEach((question, index) => {
      if (results[index.toString()] === 'yes') {
        scores[question.category] += 1;
      }
    });

    // Determine top 3 RIASEC types and corresponding clusters
    const topTypes = Object.keys(scores)
      .sort((a, b) => scores[b] - scores[a])
      .slice(0, 3);

    const topClusters = topTypes.map((type) => careerClusters[type]);

    // Connect to MongoDB and save the data
    await client.connect();
    const db = client.db('myDatabase'); // Replace with your DB name
    const collection = db.collection('recipes'); // Replace with your collection name

    await collection.updateOne(
      { user_id: userId },
      {
        $set: {
          raisec_results: { scores, topTypes, topClusters },
          'user_actions.try_riasec': true,
        },
      },
      { upsert: true } // Create the document if it doesn't exist
    );

    return NextResponse.json({
      message: 'Raisec Results have been Saved Successfully!!',
      scores,
      topTypes,
      topClusters,
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the file.' },
      { status: 500 }
    );
  }
};
