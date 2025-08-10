import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

import client from '../../lib/mongodb-connection';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { auth } from '@clerk/nextjs/server';

export default async function Home() {
  const { userId } = await auth();
  if (!userId) throw new Error('User not found');
  const findOneQuery = { user_id: userId };

  await client.connect();

  const dbName = 'myDatabase';
  const collectionName = 'recipes';

  const database = client.db(dbName);
  const collection = database.collection(collectionName);

  const findOneResult = await collection.findOne(findOneQuery);
  // console.log(findOneQuery);
  const userActions = findOneResult?.user_actions;

  return (
    <div>
      <SignedIn>
        <Table>
          <TableCaption>Tasks to be Completed</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Task Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Redo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Select Initial Career</TableCell>
              <TableCell>
                {userActions?.selected_course
                  ? 'Completed'
                  : 'Pending'}
              </TableCell>
              <TableCell>
                {userActions?.selected_course ? (
                  <Button>
                    <Link href="/select_career">Redo</Link>
                  </Button>
                ) : (
                  <Button>
                    <Link href="/select_career">Completed This</Link>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
          <TableBody>
            <TableRow>
              <TableCell>Upload Resume and Extract Skills</TableCell>
              <TableCell>
                {userActions?.skills_extracted
                  ? 'Completed'
                  : 'Pending'}
              </TableCell>
              <TableCell>
                {userActions?.skills_extracted ? (
                  <Button>
                    <Link href="/skills_extraction">Redo</Link>
                  </Button>
                ) : (
                  <Button>
                    <Link href="/skills_extraction">
                      Completed This
                    </Link>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
          <TableBody>
            <TableRow>
              <TableCell>Self Rate Skills</TableCell>
              <TableCell>
                {userActions?.self_rated ? 'Completed' : 'Pending'}
              </TableCell>
              <TableCell>
                {userActions?.self_rated ? (
                  <Button>
                    <Link href="/self_rate">Redo</Link>
                  </Button>
                ) : (
                  <Button>
                    <Link href="/self_rate">Completed This</Link>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
          <TableBody>
            <TableRow>
              <TableCell>Technical Assessment</TableCell>
              <TableCell>
                {userActions?.technical_assessment_taken
                  ? 'Completed'
                  : 'Pending'}
              </TableCell>
              <TableCell>
                {userActions?.technical_assessment_taken ? (
                  <Button>
                    <Link href="/tech_assessment">Redo</Link>
                  </Button>
                ) : (
                  <Button>
                    <Link href="/tech_assessment">
                      Completed This
                    </Link>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
          <TableBody>
            <TableRow>
              <TableCell>SFIA Assessment</TableCell>
              <TableCell>
                {userActions?.sfia_assessment_taken
                  ? 'Completed'
                  : 'Pending'}
              </TableCell>
              <TableCell>
                {userActions?.sfia_assessment_taken ? (
                  <Button>
                    <Link href="/sfia_assessment">Redo</Link>
                  </Button>
                ) : (
                  <Button>
                    <Link href="/sfia_assessment">
                      Completed This
                    </Link>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
          <TableBody>
            <TableRow>
              <TableCell>Try RIASEC?</TableCell>
              <TableCell>
                {userActions?.try_riasec ? 'Completed' : 'Pending'}
              </TableCell>
              <TableCell>
                {userActions?.try_riasec ? (
                  <Button>
                    <Link href="/try_raisec">Redo</Link>
                  </Button>
                ) : (
                  <Button>
                    <Link href="/try_raisec">Completed This</Link>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Button>Refresh</Button>
      </SignedIn>
    </div>
  );
}
