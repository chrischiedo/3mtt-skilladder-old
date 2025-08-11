import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { MongoClient, Db, Collection } from 'mongodb';
const howManyQuestionsPerWeek = 2;
const QUESTIONS_TO_SELECT = 50;

const careerToCareeerNameMapper = {
  ds: 'Data Science',
  ai: 'AI_ML',
  anim: 'Animation Curriculum',
  cyber: 'Cybersecurity',
  pm: 'Product Management ',
  devops: 'DevOps',
  qa: 'Quality Assurance',
  gd: 'Game Development',
  sd: 'Software Development',
  uiux: 'Product Design UI_UX',
  da: 'Data Analysis And Visualization',
  cc: 'Cloud Computing',
};
const databaseName: string = 'admin'; // Replace with your database name
const collectionName: string = 'mcqquestionbank_deeptech'; // Collection name
const uri = process.env.MONGODB_URI; // MongoDB connection string

if (!uri) {
  throw new Error('MONGODB_URI environment variable is not set');
}

const client = new MongoClient(uri);

interface McqQuestion {
  question_text: string;
  options: string[];
  correct_answer: string;
}

// Interface for the week-wise questions structure
interface Questions {
  questions: McqQuestion[]; // Week name as key and an array of questions
}

// Interface for the transformed document
interface TransformedDocument {
  questions: Questions;
}

// Function to transform the question bank for a specific career
const getDeepTechAssessmentQuestions =
  async (): Promise<Questions | null> => {
    let db: Db | null = null;

    try {
      await client.connect();
      db = client.db(databaseName);
      const collection: Collection = db.collection(collectionName);

      // Fetch the document for the specified career
      const document = await collection.find({});

      if (!document) {
        console.error(`No document found`);
        return null;
      }
      // Construct and return the transformed document
      const questions = await document
        .toArray()
        .then((questionsArray) =>
          questionsArray.map((question) => ({
            question_text: question.question_text,
            options: question.options,
            correct_answer: question.correct_answer,
          }))
        );
      return {
        questions: questions,
      };
    } catch (error) {
      console.error(
        'Error during retrieval and transformation:',
        error
      );
      throw error;
    } finally {
      if (client) {
        await client.close();
      }
    }
  };

// Function to get randomized questions
const getRandomizedQuestions = async (
  cohort: string
): Promise<McqQuestion[] | undefined> => {
  const result = await getDeepTechAssessmentQuestions();

  if (result) {
    const selectedQuestions: McqQuestion[] = [];

    const questions = result.questions;
    const noOfQuestions =
      cohort === 'deeptech' ? QUESTIONS_TO_SELECT : 0;

    if (questions.length >= noOfQuestions) {
      const shuffled = [...questions].sort(() => 0.5 - Math.random()); // Shuffle questions
      selectedQuestions.push(...shuffled.slice(0, noOfQuestions)); // Take first 5 shuffled
    } else {
      console.warn(
        `Not enough questions, only ${questions.length} available.`
      );
      selectedQuestions.push(...questions); // Add all questions if fewer than 5
    }

    const finalQuestions = selectedQuestions.sort(
      () => 0.5 - Math.random()
    );

    return finalQuestions;
  } else {
    console.error('No data found for the given career.');
    return undefined;
  }
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

    const formData = await req.json();
    if (!formData) {
      return NextResponse.json(
        { error: 'No json is passed' },
        { status: 400 }
      );
    }
    const cohort = formData.cohort;

    const mcqQuestions = await getRandomizedQuestions(cohort);

    return NextResponse.json({
      message: 'File uploaded and processed successfully!',
      mcqQuestions,
    });
  } catch (error) {
    console.error('Error processing file:');
    return NextResponse.json(
      { error: 'An error occurred while processing the file.' },
      { status: 500 }
    );
  }
};
