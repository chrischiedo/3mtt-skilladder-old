import React from 'react';
import AdminDashboard from '../../components/FinalAdminDashboard';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import client from '../../lib/mongodb-connection';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Terminal,
  Users,
  CheckCircle,
  PieChart,
  BarChart2,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import {
  technicalScoresByCareerPipeline,
  technicalAssessmentCompleted,
  countOfUsers,
  fellowsByCohort,
  fellowsByGender,
  fellowsByCareer,
  fellowsByEmploymentStatus,
  fellowsByEducationLevel,
  scoreBandsByCareer,
  fellowsByCareerAndCohort,
} from '@/lib/aggregations/fellows';
import CohortPieChartShadcn from '@/components/CohortPieChartShadcn';
import CareerBarChart from '@/components/CareerBarChart';
import ScoreBandsChart from '@/components/ScoreBandsChart';
import ScoreBandsDonut from '@/components/ScoreBandsDonut';
import ExportButton from '@/components/ExportButton';
import EducationLevelPieChart from '@/components/EducationLevelPieChart';
import EmploymentStatusPieChart from '@/components/EmploymentStatusPieChart';
import CareerCohortBarChart from '@/components/CareerCohortBarChart';
import FellowsDataTable from '@/components/FellowsDataTable';
import DashboardPasswordGate from '@/components/DashboardPasswordGate';

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId)
    return (
      <div>
        <SignedOut>
          <Alert>
            <Terminal className="h-4 w-4 flex-auto flex-column" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              You should sign in to access this
            </AlertDescription>

            <SignInButton>
              <button className="my-10 px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-300 flex">
                Sign In
              </button>
            </SignInButton>
          </Alert>
        </SignedOut>
      </div>
    );

  const findOneQuery = { user_id: userId };
  await client.connect();
  const dbName = 'myDatabase';
  const collectionName = 'recipes';

  const database = client.db(dbName);
  const collection = database.collection(collectionName);

  //await client.close();

  //const userData = await collection.findOne(findOneQuery);

  const userCount = await collection
    .aggregate(countOfUsers)
    .toArray();

  const techAssessmentDone = await collection
    .aggregate(technicalAssessmentCompleted)
    .toArray();

  const breakdownByCohort = await collection
    .aggregate(fellowsByCohort)
    .toArray();

  const fellowsByCareerTrack = await collection
    .aggregate(fellowsByCareer)
    .toArray();

  const scoreBands = await collection
    .aggregate(scoreBandsByCareer)
    .toArray();

  const breakdownByGender = await collection
    .aggregate(fellowsByGender)
    .toArray();

  const breakdownByEducationLevel = await collection
    .aggregate(fellowsByEducationLevel)
    .toArray();

  const breakdownByEmploymentStatus = await collection
    .aggregate(fellowsByEmploymentStatus)
    .toArray();

  const breakdownByCareerAndCohort = await collection
    .aggregate(fellowsByCareerAndCohort)
    .toArray();

  return (
    <DashboardPasswordGate>
      <div className="">
        <div className="min-h-screen py-10">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <ExportButton />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Users Card */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <h3 className="text-4xl font-bold mt-2">
                      {userCount[0]?.countOfUsers || 0}
                    </h3>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-full">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Registered platform users
                  </p>
                </div>
              </div>

              {/* Technical Assessment Card */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Technical Assessments
                    </p>
                    <h3 className="text-4xl font-bold mt-2">
                      {techAssessmentDone[0]
                        ?.technicalAssessmentTakenCount || 0}
                    </h3>
                  </div>
                  <div className="bg-green-50 p-3 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Completed assessments
                  </p>
                </div>
              </div>

              <div className="">
                {/* Cohort Distribution Card */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">
                        Cohort Distribution
                      </h3>
                      <p className="text-sm text-gray-500">
                        Users breakdown by cohort
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-full">
                      <PieChart className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                  <CohortPieChartShadcn data={breakdownByCohort} />
                </div>

                {/* You can add another card here for the second column */}
              </div>

              {/* You can add more stat cards here */}
            </div>

            {/* Education Level Distribution Card */}
            <div className="grid grid-cols-2 gap-6 mt-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      Education Level Distribution
                    </h3>
                    <p className="text-sm text-gray-500">
                      Fellows breakdown by education level
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-full">
                    <GraduationCap className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <EducationLevelPieChart
                  data={breakdownByEducationLevel}
                />
              </div>

              {/* Employment Status Distribution Card */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      Employment Status Distribution
                    </h3>
                    <p className="text-sm text-gray-500">
                      Fellows breakdown by employment status
                    </p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-full">
                    <Briefcase className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
                <EmploymentStatusPieChart
                  data={breakdownByEmploymentStatus}
                />
              </div>
            </div>

            {/* Career Distribution Card */}
            {/* <div className="col-span-full bg-white rounded-lg p-6 shadow-sm border border-gray-100 mt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Career Path Distribution
                  </h3>
                  <p className="text-sm text-gray-500">
                    Fellows breakdown by career track
                  </p>
                </div>
                <div className="bg-indigo-50 p-3 rounded-full">
                  <BarChart2 className="h-6 w-6 text-indigo-500" />
                </div>
              </div>
              <CareerBarChart data={fellowsByCareerTrack} />
            </div> */}

            {/* Career Cohort Distribution Card */}
            <div className="col-span-full bg-white rounded-lg p-6 shadow-sm border border-gray-100 mt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Career Distribution by Cohort
                  </h3>
                  <p className="text-sm text-gray-500">
                    Fellows breakdown by career track and cohort
                  </p>
                </div>
                <div className="bg-teal-50 p-3 rounded-full">
                  <BarChart2 className="h-6 w-6 text-teal-500" />
                </div>
              </div>
              <CareerCohortBarChart
                data={breakdownByCareerAndCohort}
              />
            </div>

            {/* Score Distribution Card */}
            {/* <div className="col-span-full bg-white rounded-lg p-6 shadow-sm border border-gray-100 mt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Technical Assessment Score Distribution
                  </h3>
                  <p className="text-sm text-gray-500">
                    Score bands by career path
                  </p>
                </div>
                <div className="bg-orange-50 p-3 rounded-full">
                  <BarChart2 className="h-6 w-6 text-orange-500" />
                </div>
              </div>
              <ScoreBandsChart data={scoreBands} />
            </div> */}

            {/* Score Distribution Donuts */}
            <div className="col-span-full bg-white rounded-lg p-6 shadow-sm border border-gray-100 mt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Score Distribution by Career
                  </h3>
                  <p className="text-sm text-gray-500">
                    Detailed breakdown of assessment scores
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-full">
                  <PieChart className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <ScoreBandsDonut data={scoreBands} />
            </div>

            {/* Fellows Data Table */}
            <div className="col-span-full bg-white rounded-lg p-6 shadow-sm border border-gray-100 mt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Fellows Data
                  </h3>
                  <p className="text-sm text-gray-500">
                    Detailed list of all fellows
                  </p>
                </div>
              </div>
              <FellowsDataTable />
            </div>
          </div>
        </div>
      </div>
    </DashboardPasswordGate>
  );
}
