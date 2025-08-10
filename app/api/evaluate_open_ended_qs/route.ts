import { NextResponse } from 'next/server';
import {
  GoogleGenerativeAI,
  SchemaType,
} from '@google/generative-ai';
import { auth } from '@clerk/nextjs/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // MongoDB connection string
const client = new MongoClient(uri as string);
const GEMINI_API_KEY = process.env.API_KEY_GEMINI;

const createIndividualScoresPrompt = (
  questions: string[],
  answers: string[]
): string => {
  if (questions.length !== answers.length) {
    throw new Error(
      'Questions and answers arrays must have the same length.'
    );
  }

  let prompt = `Evaluate each question and answer pair individually. For each pair, assign a score between 0 and 1, where 0 indicates extremely poor quality and 1 indicates perfect quality. Base each score on these criteria:
  1. **Correctness**: How accurate is the answer to the question?
  2. **Clarity**: Is the answer clear and easy to understand?
  3. **Relevance**: Is the answer relevant to the question asked?
  4. **Depth**: Does the answer demonstrate sufficient understanding and detail?\n\n`;

  for (let i = 0; i < questions.length; i++) {
    prompt += `Question ${i + 1}: ${questions[i]}\n`;
    prompt += `Answer ${i + 1}: ${answers[i]}\n\n`;
  }

  prompt += `Provide a score between 0 and 1 for each question-answer pair in the specified JSON format.`;
  return prompt;
};

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY ?? '');
const schema = {
  description: 'List of question evaluations',
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      marks: {
        type: SchemaType.NUMBER,
        description:
          'Score between 0 and 1 for this question-answer pair',
      },
      question_text: {
        type: SchemaType.STRING,
        description: 'The text of the question being evaluated',
      },
    },
    required: ['marks', 'question_text'],
  },
};

const modelStructuredOutput = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    responseSchema: schema,
  },
});

export const POST = async (req: Request) => {
  try {
    const formData = await req.json();

    if (!formData) {
      return NextResponse.json(
        { error: 'Invalid request data.' },
        { status: 400 }
      );
    }

    const questions = formData.questions;
    const answers = formData.answers;
    const prompt = createIndividualScoresPrompt(questions, answers);

    const result = await modelStructuredOutput.generateContent([
      { text: prompt },
    ]);

    const parsedScores = JSON.parse(result.response.text());
    const totalScore = parsedScores.reduce(
      (sum: number, item: { marks: number }) => sum + item.marks,
      0
    );
    const averageScore = totalScore / parsedScores.length;

    return NextResponse.json({
      message: 'Evaluation completed successfully!',
      scores: totalScore,
      parsedScore: parsedScores,
    });
  } catch (error) {
    console.error('Error processing evaluation:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the evaluation.' },
      { status: 500 }
    );
  }
};
