'use client';
import { PDFViewer } from '@react-pdf/renderer';
import dynamic from 'next/dynamic';
import AssessmentReport from './AssessmentReport';

// Dynamically import the AssessmentReport component

interface PDFReportProps {
  data: any;
}

const PDFReport = ({ data }: PDFReportProps) => {
  return (
    <PDFViewer style={{ width: '100%', height: '100vh' }}>
      <AssessmentReport
        data={{
          user_actions: {
            selected_course: true,
            skills_extracted: true,
            self_rated: true,
            technical_assessment_taken: true,
            sfia_assessment_taken: true,
            try_riasec: true,
          },
          selected_career: 'sd',
          skills_extracted: [
            {
              skill: 'Eclipse',
            },
            {
              skill: 'Subversion (SVN)',
            },
            {
              skill: 'C++',
            },
            {
              skill: 'React',
            },
            {
              skill: 'PostgreSQL',
            },
            {
              skill: 'Microsoft Azure',
            },
            {
              skill: 'Selenium',
            },
            {
              skill: 'RESTful APIs',
            },
          ],
          top_skills: [
            {
              skill: 'C++',
            },
            {
              skill: 'React',
            },
            {
              skill: 'PostgreSQL',
            },
            {
              skill: 'Microsoft Azure',
            },
            {
              skill: 'Selenium',
            },
          ],
          self_ratings_json: {
            'C++': 4,
            React: 4,
            PostgreSQL: 4,
            'RESTful APIs': 5,
            Selenium: 2,
          },
          technical_score: 9,
          sfia1_results: {
            isRandom: false,
            reasons: {},
            sortedCareerKeys: [
              'Cloud Computing',
              'Game Development',
              'Animation',
              'DevOps',
              'UI/UX Design',
              'Cybersecurity',
              'AI/Machine Learning',
              'Software Development',
              'Data Science',
              'Data Analysis & Visualization',
              'Product Management',
              'Quality Assurance',
            ],
            sortedCareerConfidences: [
              20.8775648759275, 18.493621544885116,
              18.493621544885116, 12.85429723500529,
              8.934591691780565, 4.872875666902037, 4.316457352881888,
              4.316457352881888, 2.6576387689803744,
              1.4494611209478898, 1.4494611209478898,
              1.283951723974434,
            ],
            scores: {
              level1: {
                level: 1,
                mcqScore: 4,
                openEndedScore: 0,
                totalScore: 4,
                percentage: 33.3,
                assessmentPassed: true,
                mcqQuestionCount: 10,
                openEndedQuestionCount: 2,
                mcqPercentage: 40,
                openEndedPercentage: 0,
              },
              level2: {
                level: 2,
                mcqScore: 2,
                openEndedScore: 0,
                totalScore: 2,
                percentage: 16.7,
                assessmentPassed: true,
                mcqQuestionCount: 10,
                openEndedQuestionCount: 2,
                mcqPercentage: 20,
                openEndedPercentage: 0,
              },
              level3: {
                level: 3,
                mcqScore: 3,
                openEndedScore: 0,
                totalScore: 3,
                percentage: 25,
                assessmentPassed: true,
                mcqQuestionCount: 10,
                openEndedQuestionCount: 2,
                mcqPercentage: 30,
                openEndedPercentage: 0,
              },
              level4: {
                level: 4,
                mcqScore: 3,
                openEndedScore: 0,
                totalScore: 3,
                percentage: 25,
                assessmentPassed: true,
                mcqQuestionCount: 10,
                openEndedQuestionCount: 2,
                mcqPercentage: 30,
                openEndedPercentage: 0,
              },
              level5: {
                level: 5,
                mcqScore: 1,
                openEndedScore: 0,
                totalScore: 1,
                percentage: 8.3,
                assessmentPassed: false,
                mcqQuestionCount: 10,
                openEndedQuestionCount: 2,
                mcqPercentage: 10,
                openEndedPercentage: 0,
              },
              level6: {
                level: 6,
                mcqScore: 0,
                openEndedScore: 0,
                totalScore: 0,
                percentage: 0,
                assessmentPassed: false,
                mcqQuestionCount: 10,
                openEndedQuestionCount: 2,
                mcqPercentage: 0,
                openEndedPercentage: 0,
              },
              level7: {
                level: 7,
                mcqScore: 0,
                openEndedScore: 0,
                totalScore: 0,
                percentage: 0,
                assessmentPassed: false,
                mcqQuestionCount: 10,
                openEndedQuestionCount: 2,
                mcqPercentage: 0,
                openEndedPercentage: 0,
              },
            },
          },
          raisec_results: {
            scores: {
              R: 3,
              I: 2,
              A: 3,
              S: 4,
              E: 6,
              C: 6,
            },
            topTypes: ['E', 'C', 'S'],
            topClusters: [
              ['Sales', 'Marketing', 'Management'],
              ['Accountant', 'Administrator', 'Clerk'],
              ['Social Worker', 'Teacher', 'Counselor'],
            ],
          },
          technical_score_mcq: 0,
          technical_score_open: 0,
          technical_assessment_results: {
            scores: [
              {
                week: 'Week1',
                totalScore: 0,
                maxPossibleScore: 3,
                percentage: '0.0',
                mcqScore: 0,
                openEndedScore: 0,
                mcqPercentage: '0.0',
                openEndedPercentage: '0.0',
              },
              {
                week: 'Week2',
                totalScore: 0,
                maxPossibleScore: 3,
                percentage: '0.0',
                mcqScore: 0,
                openEndedScore: 0,
                mcqPercentage: '0.0',
                openEndedPercentage: '0.0',
              },
              {
                week: 'Week3',
                totalScore: 0,
                maxPossibleScore: 3,
                percentage: '0.0',
                mcqScore: 0,
                openEndedScore: 0,
                mcqPercentage: '0.0',
                openEndedPercentage: '0.0',
              },
              {
                week: 'Week4',
                totalScore: 0,
                maxPossibleScore: 3,
                percentage: '0.0',
                mcqScore: 0,
                openEndedScore: 0,
                mcqPercentage: '0.0',
                openEndedPercentage: '0.0',
              },
              {
                week: 'Week5',
                totalScore: 0,
                maxPossibleScore: 3,
                percentage: '0.0',
                mcqScore: 0,
                openEndedScore: 0,
                mcqPercentage: '0.0',
                openEndedPercentage: '0.0',
              },
              {
                week: 'Week6',
                totalScore: 0,
                maxPossibleScore: 3,
                percentage: '0.0',
                mcqScore: 0,
                openEndedScore: 0,
                mcqPercentage: '0.0',
                openEndedPercentage: '0.0',
              },
              {
                week: 'Week7',
                totalScore: 0,
                maxPossibleScore: 3,
                percentage: '0.0',
                mcqScore: 0,
                openEndedScore: 0,
                mcqPercentage: '0.0',
                openEndedPercentage: '0.0',
              },
              {
                week: 'Week8',
                totalScore: 0,
                maxPossibleScore: 3,
                percentage: '0.0',
                mcqScore: 0,
                openEndedScore: 0,
                mcqPercentage: '0.0',
                openEndedPercentage: '0.0',
              },
              {
                week: 'Week9',
                totalScore: 0,
                maxPossibleScore: 3,
                percentage: '0.0',
                mcqScore: 0,
                openEndedScore: 0,
                mcqPercentage: '0.0',
                openEndedPercentage: '0.0',
              },
              {
                week: 'Week10',
                totalScore: 0,
                maxPossibleScore: 3,
                percentage: '0.0',
                mcqScore: 0,
                openEndedScore: 0,
                mcqPercentage: '0.0',
                openEndedPercentage: '0.0',
              },
              {
                week: 'Week11',
                totalScore: 0,
                maxPossibleScore: 3,
                percentage: '0.0',
                mcqScore: 0,
                openEndedScore: 0,
                mcqPercentage: '0.0',
                openEndedPercentage: '0.0',
              },
              {
                week: 'Week12',
                totalScore: 0,
                maxPossibleScore: 3,
                percentage: '0.0',
                mcqScore: 0,
                openEndedScore: 0,
                mcqPercentage: '0.0',
                openEndedPercentage: '0.0',
              },
            ],
          },
          sfia_level_max: 7,
        }}
      />
    </PDFViewer>
  );
};

export default PDFReport;
