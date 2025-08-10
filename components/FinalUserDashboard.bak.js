import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from './ui/progress';
import { SFIAChart } from './chart/sfia-chart';
import { ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { AssessmentSteps } from './AssessmentSteps';
import { RIASECChart } from './chart/raisec-chart';
import Stepper from './stepper';
import { TechnicalAssessmentPerformance } from './chart/technical-assessment-performance';
import { ScoreGrid } from './score-grid/score-grid';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { TechnicalAssessmentBreakdown } from './TechnicalAssessmentBreakdown';
import { SFIAAssessmentBreakdown } from './SFIAAssessmentBreakdown';
import sfiaData from '@/data/sfia.json';
import { usePDF, Document, Page } from '@react-pdf/renderer';
import DownloadResume from './resume/DownloadResume';
import PDFReport from './resume/PDFReport';
import Link from "next/link"

const careerToActual = {
  anim: 'Animation',
  da: 'Data Analysis and Visualization',
  gd: 'Game Development',
  cc: 'Cloud Computing',
  devops: 'Devops',
  ai: 'AI and ML',
  sd: 'Software Development',
  cyber: 'Cyber Security',
  uiux: 'UI UX',
  qa: 'Quality Assurance',
  ds: 'Data Science',
  pm: 'Product Management',
};

const RIASECAbbreviationKey = [
  {
    abbreviation: 'R',
    details: {
      name: 'Realistic',
      summary:
        'Prefers hands-on activities and working with tools or machinery.',
    },
  },
  {
    abbreviation: 'I',
    details: {
      name: 'Investigative',
      summary:
        'Enjoys exploring and understanding complex problems and systems.',
    },
  },
  {
    abbreviation: 'A',
    details: {
      name: 'Artistic',
      summary:
        'Values creativity and self-expression through various art forms.',
    },
  },
  {
    abbreviation: 'S',
    details: {
      name: 'Social',
      summary:
        'Likes to work with others and help them improve or solve problems.',
    },
  },
  {
    abbreviation: 'E',
    details: {
      name: 'Enterprising',
      summary:
        'Enjoys leading and persuading others, often in business settings.',
    },
  },
  {
    abbreviation: 'C',
    details: {
      name: 'Conventional',
      summary:
        'Prefers structured tasks and working with data or details.',
    },
  },
];

export default function UserDashboard({ userData }) {
  const {
    selected_career = null,
    technical_score,
    technical_score_mcq,
    technical_score_open,
    sfia1_results = null,
    self_ratings_json = null,
    skills_extracted = null,
    top_skills = null,
    user_actions = null,
    raisec_results = null,
    sfia_level_max,
    technical_assessment_results,
    biodata = null
  } = userData || {};

  const currentSkillLevel =
    sfia_level_max && selected_career
      ? sfiaData[selected_career].roles[sfia_level_max - 1]
      : 0;

  const sfiaSkills =
    selected_career && currentSkillLevel && sfiaData[selected_career].evaluation_areas[currentSkillLevel]
      ? Object.entries(sfiaData[selected_career].evaluation_areas[currentSkillLevel])
      : [];

  const displayMessage = (message) => (
    <p className="text-gray-500 italic">{message}</p>
  );

  return (
    <>
      <div className="min-h-screen py-10 ">
        <div className="max-w-[1400px] lg:mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - col-span-7 */}
          <div className="col-span-1 md:col-span-8 grid grid-cols-8 gap-4 space-y-3">
            {/* First Card */}
            <div className="col-span-full bg-white border-1 rounded-lg p-6 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 min-h-96">
              {/* Selected Career & Technical Score */}
              <div className="space-y-6 col-span-1">
                <section>
                  <h2 className="text-2xl font-semibold text-gray-700 gradient-text">
                    Overview
                  </h2>

                  <div className="mt-6 space-y-4">
                    <div>
                      <p className="text-sm text-gray-700 ">
                        Selected Track
                      </p>
                      <p className="font-bold text-xl">
                        {selected_career
                          ? `${careerToActual[selected_career]}`
                          : displayMessage('Not selected')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 ">
                        Technical score
                      </p>
                      <p className="font-bold text-xl">
                        {technical_score_mcq !== undefined ||
                        technical_score_open !== undefined
                          ? ` ${
                              technical_score_mcq +
                              technical_score_open
                            } / 36`
                          : displayMessage(
                              'Assessment not completed'
                            )}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="space-y-6 col-span-1">
                <section>
                  <h2 className="text-2xl font-semibold text-gray-700 gradient-text">
                    My skills
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {skills_extracted
                      ? skills_extracted.slice(0, 15).map((skill) => (
                          <Badge
                            key={skill.skill}
                            variant="outline"
                            className="border-blue-400"
                          >
                            {skill.skill}
                          </Badge>
                        ))
                      : displayMessage(
                          "The user's skills have not been extracted."
                        )}
                    {skills_extracted.length > 15 && (
                      <Link href="/skills_extraction">
                        <Button size="lg" variant="outline" className="mt-4 border-blue-500">
                          View All Skills
                        </Button>
                      </Link>
                    )}
                  </div>
                </section>
              </div>

              <div className="space-y-6 col-span-1">
                <section>
                  <h2 className="text-2xl font-semibold text-gray-700 gradient-text">
                    Self Rating
                  </h2>

                  <div className="mt-6">
                    {self_ratings_json && Object.entries(self_ratings_json).length > 0
                      ? Object.entries(self_ratings_json).slice(0, 5).map(
                          ([skill, rating], index) => (
                            <div key={index} className="mb-3 ">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-gray-700 font-medium">
                                  {skill}
                                </span>
                                <span className="text-gray-600">
                                  {rating} / 5
                                </span>
                              </div>
                              <Progress
                                className="[&>*]:bg-blue-400"
                                value={(rating / 5) * 100}
                              />
                            </div>
                          )
                        )
                      : displayMessage(
                          'The user has not rated their skills.'
                        )}
                  </div>
                  {self_ratings_json && Object.entries(self_ratings_json).length > 5 && (
                    <div className="mt-6">
                      <Link href="/self_rate">
                        <Button size="lg" variant="outline" className="w-full text-base border-blue-500">
                          View All Skills
                        </Button>
                      </Link>
                    </div>
                  )}
                </section>
              </div>
            </div>

            {/* Second card */}
            <div className="col-span-full  bg-white border-1 rounded-lg p-6 min-h-96">
              {/* SFIA Results */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-700 gradient-text">
                  Professional Capability Results
                </h2>
               
                {sfia_level_max >= 1 ? (
                  <Stepper
                    step={sfia_level_max || 0}
                    selectedCareer={selected_career}
                    active={user_actions?.technical_assessment_taken || false}
                  />
                ) : (
                  // <div className="flex justify-center items-center h-full py-20">
                  //   {displayMessage('Assessment not started.')}
                    
                  // </div>

  <Stepper
step={0}
selectedCareer={selected_career}
active={user_actions?.technical_assessment_taken || false}
/>
                )}
              </section>
            </div>

            {/* Second card */}
            <div className="col-span-full  bg-white border-1 rounded-lg p-6 min-h-64">
              {/* SFIA Results */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-700 gradient-text">
                  Technical Assessment Performance
                </h2>
                {technical_assessment_results?.scores ? (
                  <TechnicalAssessmentPerformance
                    scores={technical_assessment_results.scores}
                  />
                ) : (
                  <div className="flex justify-center items-center h-full py-20">
                    {displayMessage('Assessment not taken.')}
                  </div>
                )}
              </section>
            </div>

            <div
              id="tech-breakdown"
              className="col-span-full  bg-white border-1 rounded-lg p-6 min-h-64"
            >
              {/* Assessment Results */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-700 gradient-text">
                  Technical Score Breakdown
                </h2>
                {technical_assessment_results?.scores ? (
                  <ScrollArea className="h-96">
                    <TechnicalAssessmentBreakdown
                      scores={technical_assessment_results.scores}
                    />
                  </ScrollArea>
                ) : (
                  <div className="flex justify-center items-center h-full py-20">
                    {displayMessage('Assessment not taken.')}
                  </div>
                )}
              </section>
            </div>

            <div className="col-span-full  bg-white border-1 rounded-lg p-6 min-h-64">
              {/* SFIA Breakdown */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-700 gradient-text">
                  Professional Capability Breakdown
                </h2>
                {sfia1_results?.scores ? (
                  <ScrollArea className="h-96">
                    <SFIAAssessmentBreakdown
                      scores={sfia1_results.scores}
                    />
                    <ScrollBar />
                  </ScrollArea>
                ) : (
                  <div className="flex justify-center items-center h-full py-20">
                    {displayMessage('Assessment not taken.')}
                  </div>
                )}
              </section>
            </div>

            <div className="col-span-full  bg-white border-1 rounded-lg p-6 min-h-96">
              {/* SFIA Results */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-700 gradient-text">
                  Required Capabilities
                </h2>
                <div>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {sfia_level_max && selected_career
                      ? sfiaData[selected_career].skills_tested.map(
                          (skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="border-blue-400"
                            >
                              {skill}
                            </Badge>
                          )
                        )
                      : displayMessage(
                          'RAISEC assessment not taken.'
                        )}
                  </div>
                </div>
                <div className="flex  flex-col  mt-4 space-y-3">
                  <h2 className="text-2xl font-semibold text-gray-700 gradient-text">
                    Evaluation Areas
                  </h2>

                  {sfia_level_max && selected_career && sfiaSkills.length > 0
                    ? sfiaSkills.map((i, index) => (
                        <div key={index}>
                          <>
                            <p key={index} className="font-bold">
                              {i[0]}
                              {':'}
                            </p>
                            <ul className="font-normal ml-1">
                              {i[1].map((item, subIndex) => (
                                <li key={subIndex}>{item}</li>
                              ))}
                            </ul>
                          </>
                        </div>
                      ))
                    : displayMessage('No evaluation areas available.')}

                  {/* {Object.entries(sfiaData[selected_career].evaluation_areas[sfia_level_max]).map(([key, value]) =>
                        .map((item) => (
                          <>
                            <p
                              key={item.abbreviation}
                              className="font-bold"
                            >
                              {item.details.name}
                              {':'}
                              <span className="font-normal ml-1">
                                {item.details.summary}
                              </span>
                            </p>
                          </>
                        ))
                      )
                    : displayMessage('RIASEC assessment not taken.')} */}
                </div>
              </section>
            </div>

            {/* Third Card */}

            <div className="col-span-full lg:col-span-4 bg-white border-1 rounded-lg p-6 min-h-96">
              {/* SFIA Results */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-700 gradient-text">
                  RIASEC Results
                </h2>
                {raisec_results ? (
                  <div className="mt-2">
                    <RIASECChart data={raisec_results.scores} />
                  </div>
                ) : (
                  displayMessage(
                    'The user has not completed the  assessment.'
                  )
                )}
              </section>
            </div>

            <div className="col-span-full lg:col-span-4 bg-white border-1 rounded-lg p-6 min-h-96">
              {/* SFIA Results */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-700 gradient-text">
                  Other career recommendations
                </h2>
                <div>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {raisec_results
                      ? raisec_results.topClusters
                          .flat()
                          .map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="border-blue-400"
                            >
                              {skill}
                            </Badge>
                          ))
                      : displayMessage(
                          'RAISEC assessment not taken.'
                        )}
                  </div>
                </div>
                <div className="flex  flex-col  mt-4 space-y-3">
                  <h2 className="text-2xl font-semibold text-gray-700 gradient-text">
                    Top RAISEC Clusters
                  </h2>
                  {raisec_results
                    ? raisec_results.topTypes.flat().map((cluster) =>
                        RIASECAbbreviationKey.filter(
                          (item) => item.abbreviation === cluster
                        ).map((item) => (
                          <>
                            <p
                              key={item.abbreviation}
                              className="font-bold"
                            >
                              {item.details.name}
                              {':'}
                              <span className="font-normal ml-1">
                                {item.details.summary}
                              </span>
                            </p>
                          </>
                        ))
                      )
                    : displayMessage('RIASEC assessment not taken.')}
                </div>
              </section>
            </div>
          </div>

          {/* Right Column - col-span-3 */}
          <div className=" col-span-1 md:col-span-4 order-first lg:order-none">
            <div className="bg-white border-1 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-700 gradient-text">
                Assessment Steps
              </h2>

              <div className="mt-6">
                <AssessmentSteps actions={user_actions} />
              </div>

              {/* <DownloadResume data={biodata} /> */}

             
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
