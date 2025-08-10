import {SignedIn, SignedOut, SignInButton} from '@clerk/nextjs';
import CareerForm from '../../components/SelectInitialCourseForm';

export default async function Home() {
  return (
    <div className="flex items-center justify-center">
      <SignedIn>
        <CareerForm />
      </SignedIn>
      <SignedOut>
        <SignInButton></SignInButton>
      </SignedOut>
    </div>
  );
}