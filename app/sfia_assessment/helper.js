function calculateMean(arr) {
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return sum / arr.length;
  }
  
  function calculateStandardDeviation(arr, mean) {
    const variance = arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / arr.length;
    return Math.sqrt(variance);
  }
  
  function zScore(arr) {
    const mean = calculateMean(arr);
    const stdDev = calculateStandardDeviation(arr, mean);
    return arr.map((val) => (stdDev === 0 ? 0 : (val - mean) / stdDev));
  }

// Career attribute weights
const careerAttributeWeights = {
  "UI/UX Design": { creativity: 0.3, user_experience: 0.4, design: 0.3 },
  "AI/Machine Learning": { technology: 0.3, coding_ability: 0.3, innovation: 0.4 },
  "Data Science": { data_analysis: 0.4, technology: 0.3, coding_ability: 0.3 },
  "Cloud Computing": { technology: 0.4, adaptability: 0.3, innovation: 0.3 },
  "Data Analysis & Visualization": { data_analysis: 0.5, reports: 0.3, technology: 0.2 },
  Cybersecurity: { problem_solving: 0.4, technology: 0.4, innovation: 0.2 },
  "Product Management": { leadership: 0.4, strategic_planning: 0.3, collaboration: 0.3 },
  "Software Development": { coding_ability: 0.5, technology: 0.3, problem_solving: 0.2 },
  "Quality Assurance": { structured_environment: 0.4, problem_solving: 0.3, reports: 0.3 },
  DevOps: { technology: 0.4, problem_solving: 0.4, adaptability: 0.2 },
  "Game Development": { creativity: 0.4, technology: 0.3, design: 0.3 },
  Animation: { creativity: 0.5, design: 0.3, user_experience: 0.2 },
};

// Mapping of questions to attributes
const questionToAttributes = {
  "I enjoy activities that involve creative problem-solving.": { creativity: 1 },
  "I find myself drawn to hobbies that involve working with technology.": { technology: 1 },
  "I am passionate about topics related to innovation and cutting-edge technology.": { innovation: 1 },
  "I prefer subjects that involve analyzing data and drawing conclusions.": { data_analysis: 1 },
  "I am interested in creating designs that enhance user experience.": { user_experience: 1, design: 1 },
  "I can quickly adapt to new software and technologies.": { adaptability: 1 },
  "When faced with a challenging problem, I methodically break it down into manageable parts.": { problem_solving: 1 },
  "I often take the lead in group projects, ensuring tasks are completed efficiently.": { leadership: 1 },
  "I have experience writing code to solve complex problems.": { coding_ability: 1 },
  "I excel in creating detailed reports that summarize data findings.": { reports: 1 },
  "I enjoy working independently without much supervision.": { independence: 1 },
  "I prefer to work in a structured environment where tasks are clearly defined.": { structured_environment: 1 },
  "I thrive in fast-paced environments where I can take on multiple challenges at once.": { adaptability: 1 },
  "I like being part of a team that collaborates on projects and shares ideas.": { collaboration: 1 },
  "I enjoy coming up with creative solutions rather than following a set process.": { creativity: 1 },
  "I value job stability over working in a rapidly changing industry.": { stability: 1 },
  "I prefer a career that offers a balance between work and personal life.": { work_life_balance: 1 },
  "Making a positive social impact through my work is important to me.": { social_impact: 1 },
  "I am motivated by financial incentives when choosing a career.": { financial_incentives: 1 },
  "I would rather work in an innovative environment than in a traditional, stable company.": { innovation: 1 },
  "If given the choice, I would work in an industry that is technology-driven.": { technology: 1 },
  "I would prefer a role that allows me to work on creative projects with a tangible outcome.": { creativity: 1 },
  "I enjoy working in an environment where collaboration is a key part of the process.": { collaboration: 1 },
  "I prefer roles that involve a mix of hands-on work and strategic planning.": { strategic_planning: 1, hands_on_work: 1 },
  "I would thrive in a career that challenges me to constantly learn and adapt.": { adaptability: 1 },
  "I have a clear long-term goal for my career that I am actively working towards.": { long_term_goals: 1 },
  "I am open to relocating if it means advancing in my career.": { adaptability: 1 },
  "I consider the potential for growth and advancement when choosing a career path.": { career_growth: 1 },
  "I would prioritize a career that aligns with my personal values, even if it means sacrificing financial gain.": { personal_values: 1 },
  "I have personal constraints that significantly influence my career choices.": { personal_constraints: 1 },
};

// Response scores
const responseScores = {
  "Strongly Agree": 2.0,
  Agree: 1.0,
  Neutral: 0.0,
  Disagree: -1.0,
  "Strongly Disagree": -2.0,
};

// Detect random responses
function detectRandomResponses(responses) {
  const responseValues = Object.values(responses);
  const reasons = {};

  // Check for uniform pattern
  if (new Set(responseValues).size === 1) {
    reasons["Uniform Pattern"] = "All responses are the same.";
  }

  // Check for skewed distribution
  const responseCounts = responseValues.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  const totalResponses = responseValues.length;
  const maxFrequency = Math.max(...Object.values(responseCounts));
  if (maxFrequency / totalResponses > 0.8) {
    reasons["Skewed Distribution"] = "More than 80% of responses are identical.";
  }

  return { isRandom: Object.keys(reasons).length > 0, reasons };
}

// Calculate best career
function calculateBestCareer(responses) {
  const { isRandom, reasons } = detectRandomResponses(responses);

  const careerScores = {};
  Object.keys(careerAttributeWeights).forEach((career) => {
    careerScores[career] = 0;
  });

  Object.entries(responses).forEach(([question, response]) => {
    const attributes = questionToAttributes[question] || {};
    const score = responseScores[response] || 0;

    Object.entries(attributes).forEach(([attribute, weight]) => {
      Object.entries(careerAttributeWeights).forEach(([career, weights]) => {
        if (weights[attribute]) {
          careerScores[career] += score * weight * weights[attribute];
        }
      });
    });
  });

  // Normalize using z-score
  const scoresArray = Object.values(careerScores);
  const normalizedScores = zScore(scoresArray);

  // Calculate confidence percentages
  const expScores = normalizedScores.map((z) => Math.exp(z));
  const totalExpScores = expScores.reduce((a, b) => a + b, 0);

  const careerConfidences = Object.keys(careerScores).reduce((acc, career, i) => {
    acc[career] = (expScores[i] / totalExpScores) * 100;
    return acc;
  }, {});

  // Sort careers by confidence
  const sortedCareers = Object.entries(careerConfidences).sort((a, b) => b[1] - a[1]);

  return {
    isRandom,
    reasons,
    sortedCareerKeys: sortedCareers.map(([career]) => career),
    sortedCareerConfidences: sortedCareers.map(([, confidence]) => confidence),
  };
}

export default calculateBestCareer;