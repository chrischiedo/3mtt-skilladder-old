//Pipelines for count of users
export const countOfUsers = [
  // Stage 1: Group by _id and count the number of documents for each _id
  {
    $group: {
      _id: '$_id', // Group by the _id field
    },
  },
  // Stage 2: Count the total number of distinct _id documents
  {
    $count: 'countOfUsers', // Count the number of distinct _id entries
  },
];

//Pipiline for technical assessments completed
export const technicalAssessmentCompleted = [
  // Stage 1: Match documents where technical_assessment_taken is true
  {
    $match: {
      'user_actions.technical_assessment_taken': true,
    },
  },
  // Stage 2: Group everything together and count the documents
  {
    $group: {
      _id: null, // Use `null` to group all matching documents into one group
      technicalAssessmentTakenCount: { $sum: 1 }, // Count the number of matching documents
    },
  },
  // Stage 3: Project the count (optional for better readability)
  {
    $project: {
      _id: 0, // Remove the `_id` field from the output
      technicalAssessmentTakenCount: 1,
    },
  },
];

// Pipeline to count fellows by selected career
export const fellowsByCareer = [
  {
    $match: {
      fellow_id: { $regex: '^FE/' }, // Matches only fellows starting with "FE/"
    },
  },
  {
    $group: {
      _id: '$selected_career', // Group by selected_career
      totalNumberOfFellows: { $sum: 1 }, // Count matching records
    },
  },
  {
    $sort: {
      _id: 1, // Sort by selected_career alphabetically
    },
  },
];

// Pipeline to count fellows by gender
export const fellowsByGender = [
  {
    $match: {
      fellow_id: { $regex: '^FE/' }, // Matches only fellows
      'biodata.gender': { $exists: true, $ne: null }, // Ensure gender exists and isn't null
    },
  },
  {
    $group: {
      _id: '$biodata.gender', // Group by gender
      count: { $sum: 1 }, // Count fellows in each gender group
    },
  },
  {
    $sort: {
      _id: 1, // Sort alphabetically by gender
    },
  },
];

// Pipeline to count fellows by education level
export const fellowsByEducationLevel = [
  {
    $match: {
      fellow_id: { $regex: '^FE/' }, // Matches only fellows
      'biodata.educationLevel': { $exists: true, $ne: '' }, // Ensure education level exists and isn't null or empty
    },
  },
  {
    $group: {
      _id: '$biodata.educationLevel', // Group by education level
      count: { $sum: 1 }, // Count fellows in each education level group
    },
  },
  {
    $sort: {
      _id: 1, // Sort alphabetically by education level
    },
  },
];

// Pipeline to count fellows by employment status
export const fellowsByEmploymentStatus = [
  {
    $match: {
      fellow_id: { $regex: '^FE/' }, // Matches only fellows
      'biodata.employmentStatus': { $exists: true, $ne: '' }, // Ensure employment status exists and isn't empty
    },
  },
  {
    $group: {
      _id: '$biodata.employmentStatus', // Group by employment status
      count: { $sum: 1 }, // Count fellows in each employment status group
    },
  },
  {
    $sort: {
      _id: 1, // Sort alphabetically by employment status
    },
  },
];

// Pipeline to get min/max technical scores by career
export const technicalScoresByCareerPipeline = [
  // Stage 1: Group by `selected_career`
  {
    $group: {
      _id: '$selected_career', // Group by selected_career
      maxTechnicalScoreMCQ: { $max: '$technical_score_mcq' },
      minTechnicalScoreMCQ: { $min: '$technical_score_mcq' },
      maxTechnicalScoreOpen: { $max: '$technical_score_open' },
      minTechnicalScoreOpen: { $min: '$technical_score_open' },
    },
  },
  // Stage 2: Project the final structure
  {
    $project: {
      _id: 1,
      maxTechnicalScoreMCQ: 1,
      minTechnicalScoreMCQ: 1,
      maxTechnicalScoreOpen: 1,
      minTechnicalScoreOpen: 1,
    },
  },
];

//Pipeline to group by cohort
export const fellowsByCohort = [
  // Stage 1: Match to exclude null cohorts
  {
    $match: {
      cohort: { $ne: null },
    },
  },
  // Stage 2: Group by cohort and count the number of documents in each cohort
  {
    $group: {
      _id: '$cohort', // Group by the cohort field
      cohortCount: { $sum: 1 }, // Count the number of documents in each cohort group
    },
  },
  // Stage 3: Sort by cohort
  {
    $sort: {
      _id: 1, // Sort by cohort in ascending order
    },
  },
  // Stage 4: Project the result for cleaner output
  {
    $project: {
      _id: 1, // Include the cohort (grouped by _id)
      cohortCount: 1, // Include the count of each cohort
    },
  },
];

//Pipeline to get score bands by selected career
export const scoreBandsByCareer = [
  // Stage 1: Match only the fellows (fellow_id starts with "FE/")
  {
    $match: {
      fellow_id: { $regex: '^FE/' }, // Match fellow_id that starts with "FE/"
    },
  },
  // Stage 2: Group by selected_career and collect technical_score_mcq
  {
    $group: {
      _id: '$selected_career', // Group by selected_career
      scoreRanges: { $push: '$technical_score_mcq' }, // Push technical_score_mcq to an array
    },
  },
  // Stage 3: Calculate the count of fellows in each score range
  {
    $project: {
      selected_career: '$_id', // Rename _id to selected_career
      scoreBands: [
        {
          range: '0-9',
          count: {
            $size: {
              $filter: {
                input: '$scoreRanges',
                as: 'score',
                cond: { $lt: ['$$score', 10] }, // Score less than 10
              },
            },
          },
        },
        {
          range: '10-18',
          count: {
            $size: {
              $filter: {
                input: '$scoreRanges',
                as: 'score',
                cond: {
                  $and: [
                    { $gte: ['$$score', 10] },
                    { $lt: ['$$score', 19] },
                  ],
                },
              },
            },
          },
        },
        {
          range: '19-27',
          count: {
            $size: {
              $filter: {
                input: '$scoreRanges',
                as: 'score',
                cond: {
                  $and: [
                    { $gte: ['$$score', 19] },
                    { $lt: ['$$score', 28] },
                  ],
                },
              },
            },
          },
        },
        {
          range: '28-36',
          count: {
            $size: {
              $filter: {
                input: '$scoreRanges',
                as: 'score',
                cond: {
                  $and: [
                    { $gte: ['$$score', 28] },
                    { $lt: ['$$score', 37] },
                  ],
                },
              },
            },
          },
        },
      ],
    },
  },
  // Stage 4: Clean up the result to make it readable
  {
    $project: {
      _id: 0, // Exclude _id
      selected_career: 1, // Include selected_career
      scoreBands: 1, // Include scoreBands with count of fellows in each range
    },
  },
];

// Pipeline to count fellows by selected career and cohort
export const fellowsByCareerAndCohort = [
  {
    $match: {
      fellow_id: { $regex: '^FE/' }, // Matches only fellows starting with "FE/"
    },
  },
  {
    $group: {
      _id: {
        career: '$selected_career',
        cohort: '$cohort',
      },
      totalNumberOfFellows: { $sum: 1 }, // Count matching records
    },
  },
  {
    $group: {
      _id: '$_id.career',
      cohorts: {
        $push: {
          cohort: '$_id.cohort',
          count: '$totalNumberOfFellows',
        },
      },
    },
  },
  {
    $sort: {
      _id: 1, // Sort careers alphabetically
    },
  },
  {
    $project: {
      _id: 1,
      career: '$_id',
      cohorts: 1,
    },
  },
];
