import { MongoClient } from 'mongodb';
import { parse } from 'json2csv';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const MONGO_URI = process.env.MONGODB_URI; // Replace with your MongoDB URI
const DB_NAME = 'myDatabase'; // Replace with your database name

export async function GET(req) {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db(DB_NAME);
    const collection = db.collection('recipes'); // Replace with your collection name

    // Aggregation pipeline to flatten the MongoDB data
    const pipeline = [
      {
        $match: {
          //fellow_id: { $regex: '^FE/' },
          technical_score_mcq: { $ne: null },
        },
      },

      {
        $project: {
          user_id: 1,
          fellow_id: 1,
          cohort: 1,
          selected_career: 1,

          
          // technical_score_mcq: 1,
          technical_assessment_score: '$technical_score_mcq',
          first_name: '$biodata.firstName',
          last_name: '$biodata.lastName',
          date_of_birth: '$biodata.dateOfBirth',
          gender: '$biodata.gender',
          email: '$biodata.email',
          state: '$biodata.state',
          lga: '$biodata.lga',
          education_level: '$biodata.educationLevel',
          years_of_experience: '$biodata.yearsOfExperience',
          employment_status: '$biodata.employmentStatus',
          professional_capability_level: '$sfia_level_max',
          professional_capability_level_1_mcq_percent:
            '$sfia1_results.scores.level1.mcqPercentage',
          professional_capability_level_2_mcq_percent:
            '$sfia1_results.scores.level2.mcqPercentage',
          professional_capability_level_3_mcq_percent:
            '$sfia1_results.scores.level3.mcqPercentage',
          professional_capability_level_4_mcq_percent:
            '$sfia1_results.scores.level4.mcqPercentage',
          professional_capability_level_5_mcq_percent:
            '$sfia1_results.scores.level5.mcqPercentage',
          professional_capability_level_6_mcq_percent:
            '$sfia1_results.scores.level6.mcqPercentage',
          professional_capability_level_7_mcq_percent:
            '$sfia1_results.scores.level7.mcqPercentage',
          riasec_R_score: '$raisec_results.scores.R',
          riasec_I_score: '$raisec_results.scores.I',
          riasec_A_score: '$raisec_results.scores.A',
          riasec_S_score: '$raisec_results.scores.S',
          riasec_E_score: '$raisec_results.scores.E',
          riasec_C_score: '$raisec_results.scores.C',
          questionsTaken: {
            $cond: {
              if: { $eq: ['$technical_score_mcq', null] },
              then: null,
              else: {
                $reduce: {
                  input: '$technical_assessment_results.scores',
                  initialValue: 0,
                  in: {
                    $add: ['$$value', '$$this.maxPossibleScore'],
                  },
                },
              },
            },
          },
        },
      },
    ];

    // Run the aggregation pipeline
    const cursor = collection.aggregate(pipeline);
    const results = await cursor.toArray();

    // Convert the results to CSV
    const csv = parse(results);

    // Set file path and name
    // const filePath = path.resolve('./public', 'flattened_data.csv');

    // // Write CSV to public folder
    // fs.writeFileSync(filePath, csv);

    // Return the CSV file URL for download
    // return new Response(
    //   JSON.stringify({
    //     message: 'CSV export successful',
    //     fileUrl: '/flattened_data.csv', // The URL to access the file
    //   }),
    //   {
    //     status: 200,
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // );

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition':
          'attachment; filename=fellows_data.csv',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: 'Something went wrong' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
