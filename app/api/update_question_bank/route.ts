import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { auth } from '@clerk/nextjs/server'
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // MongoDB connection string
const client = new MongoClient(uri as string);
const GEMINI_API_KEY = process.env.API_KEY_GEMINI;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const mcqSchema = {
  description: "List of multiple-choice questions",
  type: "array", // Assuming SchemaType constants resolve to standard types
  items: {
    type: "object",
    properties: {
      question_text: {
        type: "string",
        description: "The question text",
        nullable: false, // You can omit this if the platform uses JSON Schema where 'nullable: false' is default
      },
      options: {
        type: "array",
        description: "Possible options",
        items: {
          type: "string", // Each option should be a string
        },
        nullable: false,
      },
      correct_answer: {
        type: "string",
        description: "The correct answer",
        nullable: false,
      },
    },
    required: ["question_text", "options", "correct_answer"],
  },
};

const openSchema = {
  description: "List of open ended questions",
  type: "array",
  items: {
    type: "object",
    properties: {
      question_text: {
        type: "string",
        description: "The question text",
        nullable: false, // You can omit this if the platform uses JSON Schema where 'nullable: false' is default
      },
      type_of_question: {
        type: "string",
        description: "The correct answer",
        nullable: false,
      },
    },
    required: ["question_text"],
  },
};

const modelStructuredOutput = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: mcqSchema,
  }
});

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth(); // Get the logged-in user's ID
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Parse the form data
    const formData = await req.json();
    // console.log(formData);

    if (!formData) {
      return NextResponse.json(
        { error: 'No json is passed' },
        { status: 400 }
      );
    }
    
    const result = await modelStructuredOutput.generateContent([
      { text: `Given the career or career path: ${formData.course} and the course syllabus ${JSON.stringify(formData.week1Text)}. generate 10 MCQ questins to test the user on the selected career or the course. Please note that questions should be realistic question which are used in assessments and the difficulty level of these questions would be at the level of ${formData.level}. Generated Questions should only cover the topics mentioned in the syllabus`},
    ]);
    const mcqQuestions = JSON.parse(result.response.text());
    // console.log(mcqQuestions);

    // console.log('Extracted Text:', resumeParseText);
    // const skillsJsonText = await modelStructuredOutput.generateContent([{text: `Take the following and extract all the skills mentioned here ${resumeParseText}`}])
    // const skillsJson = JSON.parse(skillsJsonText.response.text())
    // console.log('Extracted Text:', skillsJson);

    // const topSkills = await modelStructuredOutput.generateContent([{text: `Take the following and extract top skills which are represntive of most of these. Extract some 5-10 represntitive skills. ${resumeParseText}`}]);
    // const topSkillsJson = JSON.parse(topSkills.response.text());

    // await client.connect();
    // const db = client.db('myDatabase'); // Replace with your DB name
    // const collection = db.collection('recipes'); // Replace with your collection name

    // await collection.updateOne(
    //   { user_id : userId },
    //   { $set: { skills_extracted: skillsJson,
    //     'user_actions.skills_extracted': true,
    //     top_skills: topSkillsJson
    //    } },
    //   { upsert: false } // Create the document if it doesn't exist
    // );
    
    return NextResponse.json({
      message: 'File uploaded and processed successfully!',
      mcqQuestions
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the file.' },
      { status: 500 }
    );
  }
};