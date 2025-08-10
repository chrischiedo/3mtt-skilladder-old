import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { MongoClient, Db, Collection } from 'mongodb';

const howManyQuestionsPerWeek = 1;
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
const collectionName: string = 'openendedquestionbank_deeptech'; // Collection name
const uri = process.env.MONGODB_URI_QB; // MongoDB connection string
const client = new MongoClient(uri as string);

// Interface for the week-wise questions structure
interface WeekWiseQuestions {
  [week: string]: string[]; // Week name as key and an array of questions
}

// Interface for the transformed document
interface TransformedDocument {
  career: string;
  week_wise_questions: WeekWiseQuestions;
}

// Function to transform the question bank for a specific career
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

    // Transform the week-wise questions
    const transformedWeekWiseQuestions: WeekWiseQuestions = {};

    for (const [week, levels] of Object.entries(
      document.week_wise_questions
    )) {
      transformedWeekWiseQuestions[week] =
        Object.values(levels).flat();
    }

    // Construct and return the transformed document
    return {
      career: document.career,
      week_wise_questions: transformedWeekWiseQuestions,
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
  career: string,
  cohort: string
): Promise<string[] | undefined> => {
  const result = await getTransformedQuestionBankByCareer(career);

  if (result) {
    const selectedQuestions: string[] = [];

    // Select 5 random questions from each week
    for (const [week, questions] of Object.entries(
      result.week_wise_questions
    )) {
      // Add week property to each question
      const questionsWithWeek = questions.map((question) => ({
        question_text: question.question_text,
        week: week,
      }));

      const _howManyQuestionsPerWeek = (() => {
        switch (cohort) {
          case 'deeptech':
            return 0;

          default:
            return 0;
        }
      })();

      if (questions.length >= _howManyQuestionsPerWeek) {
        const shuffled = [...questionsWithWeek].sort(
          () => 0.5 - Math.random()
        ); // Shuffle questions
        selectedQuestions.push(
          ...shuffled.slice(0, _howManyQuestionsPerWeek)
        ); // Take first 5 shuffled questions
      } else {
        console.warn(
          `Not enough questions in ${week}, only ${questions.length} available.`
        );
        selectedQuestions.push(...questionsWithWeek); // Add all questions if fewer than 5
      }
    }

    // Shuffle the final 60 questions
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

    const careerKey = formData.course;
    const careerName = careerToCareeerNameMapper[careerKey];
    const cohort = formData.cohort;

    const openEndedQuestions = await getRandomizedQuestions(
      careerName,
      cohort
    );

    return NextResponse.json({
      message: 'File uploaded and processed successfully!',
      openEndedQuestions,
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the file.' },
      { status: 500 }
    );
  }
};
