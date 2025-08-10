import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { MongoClient, Db, Collection } from 'mongodb';

const howManyQuestionsPerLevel = 2;

const careerToCareeerNameMapper = {
  ds: 'Data Science',
  ai: 'AI_ML',
  anim: 'Animation Curriculum',
  cyber: 'Cybersecurity',
  pm: 'Product Management',
  devops: 'DevOps',
  qa: 'Quality Assurance',
  gd: 'Game Development',
  sd: 'Software Development',
  uiux: 'Product Design UI_UX',
  da: 'Data Analysis And Visualization',
  cc: 'Cloud Computing',
};

const databaseName: string = 'admin'; // Replace with your database name
const collectionName: string = 'openendedquestionbank'; // Collection name
const uri = process.env.MONGODB_URI_QB; // MongoDB connection string
const client = new MongoClient(uri as string);

// Interface for the level-wise questions structure
interface LevelWiseQuestions {
  [level: string]: string[]; // Level name as key and an array of questions
}

// Interface for the transformed document
interface TransformedDocument {
  career: string;
  level_wise_questions: LevelWiseQuestions;
}

// Function to transform the question bank for a specific career by levels
const getTransformedQuestionBankByCareer = async (
  career: string
): Promise<TransformedDocument | null> => {
  let db: Db | null = null;

  try {
    await client.connect();
    db = client.db(databaseName);
    const collection: Collection = db.collection(collectionName);

    // Fetch the document for the specified career
    const document = await collection.findOne({ career });

    if (!document) {
      console.error(`No document found for career: ${career}`);
      return null;
    }

    // Transform the level-wise questions
    const transformedLevelWiseQuestions: LevelWiseQuestions = {};

    for (const [week, levels] of Object.entries(
      document.week_wise_questions
    )) {
      for (const [level, questions] of Object.entries(levels)) {
        if (!transformedLevelWiseQuestions[level]) {
          transformedLevelWiseQuestions[level] = [];
        }
        transformedLevelWiseQuestions[level].push(...questions);
      }
    }

    // Construct and return the transformed document
    return {
      career: document.career,
      level_wise_questions: transformedLevelWiseQuestions,
    };
  } catch (error) {
    console.error(
      'Error during retrieval and transformation:',
      error
    );
    throw error;
  }
};

// Function to get randomized questions by level
const getRandomizedQuestionsByLevel = async (
  career: string
): Promise<{ [level: string]: string[] } | undefined> => {
  const result = await getTransformedQuestionBankByCareer(career);

  if (result) {
    const selectedQuestionsByLevel: { [level: string]: string[] } =
      {};

    // Select 10 random questions from each level
    for (const [level, questions] of Object.entries(
      result.level_wise_questions
    )) {
      if (questions.length >= howManyQuestionsPerLevel) {
        const shuffled = [...questions].sort(
          () => 0.5 - Math.random()
        ); // Shuffle questions
        selectedQuestionsByLevel[level] = shuffled.slice(
          0,
          howManyQuestionsPerLevel
        ); // Take first 10 shuffled questions
      } else {
        console.warn(
          `Not enough questions in ${level}, only ${questions.length} available.`
        );
        selectedQuestionsByLevel[level] = questions; // Add all questions if fewer than 10
      }
    }

    return selectedQuestionsByLevel;
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

    const careerKey = formData.course;
    const careerName = careerToCareeerNameMapper[careerKey];

    const mcqQuestionsByLevel = await getRandomizedQuestionsByLevel(
      careerName
    );
    return NextResponse.json({
      message: 'File uploaded and processed successfully!',
      mcqQuestionsByLevel,
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the file.' },
      { status: 500 }
    );
  }
};
