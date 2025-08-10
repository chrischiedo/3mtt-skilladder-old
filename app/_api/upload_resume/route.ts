import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { auth } from '@clerk/nextjs/server'
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // MongoDB connection string
const client = new MongoClient(uri as string);
const GEMINI_API_KEY = process.env.API_KEY_GEMINI;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const schema = {
  description: "List of skills",
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      skill: {
        type: SchemaType.STRING,
        description: "Name of the Skill",
        nullable: false,
      },
    },
    required: ["skill"],
  },
};
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const modelStructuredOutput = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  }
});

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth(); // Get the logged-in user's ID
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Parse the form data
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file || file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF files are allowed.' },
        { status: 400 }
      );
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    const base64String = fileBuffer.toString("base64");
    const genaiData = {
      "inlineData": {
        "data": base64String,
        "mimeType" : "application/pdf"
      },
    };
    const result = await model.generateContent([genaiData,
      { text: "Can you extract all the skills mentioned in the given document?" },
    ]);
    const resumeParseText = result.response.text();
    
    console.log('Extracted Text:', resumeParseText);
    const skillsJsonText = await modelStructuredOutput.generateContent([{text: `Take the following and extract all the skills mentioned here ${resumeParseText}`}])
    const skillsJson = JSON.parse(skillsJsonText.response.text())
    console.log('Extracted Text:', skillsJson);

    const topSkills = await modelStructuredOutput.generateContent([{text: `Take the following and extract top skills which are represntive of most of these. Extract some 5-10 represntitive skills. ${resumeParseText}`}]);
    const topSkillsJson = JSON.parse(topSkills.response.text());

    await client.connect();
    const db = client.db('myDatabase'); // Replace with your DB name
    const collection = db.collection('recipes'); // Replace with your collection name

    await collection.updateOne(
      { user_id : userId },
      { $set: { skills_extracted: skillsJson,
        'user_actions.skills_extracted': true,
        top_skills: topSkillsJson
       } },
      { upsert: false } // Create the document if it doesn't exist
    );
    
    return NextResponse.json({
      message: 'File uploaded and processed successfully!'
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the file.' },
      { status: 500 }
    );
  }
};