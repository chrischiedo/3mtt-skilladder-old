import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import Image from 'next/image';
import './globals.css';
import Link from 'next/link';

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-primary',
});

// const dmSans = DM_Sans({
//   subsets: ['latin'],
//   variable: '--font-primary',
// });
// const outfit = Outfit({
//   subsets: ['latin'],
//   variable: '--font-display',
// });

export const metadata: Metadata = {
  title: 'Skill Assessment',
  description: '3MTT Skill Assessment',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${quicksand.variable}  antialiased`}>
          <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Navbar */}
            <header className="hidden w-full bg-blue-500 text-white py-4">
              <div className="container mx-auto flex items-center justify-between px-4">
                {/* Add a logo or title here if needed */}
                <Link
                  href="/"
                  className="flex items-center space-x-2"
                >
                  <Image
                    src="/logo.png" // Replace with your logo path
                    alt="MyApp Logo"
                    width={40}
                    height={40}
                    className="rounded"
                  />
                  <span className="text-xl font-bold">
                    Career and Skill Assessment
                  </span>
                </Link>
                {/* <h1 className="text-xl font-bold">Career and Skill Assessment</h1> */}
                {/* Authentication Buttons */}
                <div className="flex items-center space-x-4">
                  <SignedOut>
                    <SignInButton>
                      <button className="px-6 py-2 bg-white-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-300">
                        Sign In
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <Link
                      href="/"
                      className="block px-4 py-2 rounded hover:bg-gray-700"
                    >
                      Home
                    </Link>
                    <Link
                      href="/tasks"
                      className="block px-4 py-2 rounded hover:bg-gray-700"
                    >
                      Complete Tasks
                    </Link>
                    <div className="block px-4 py-2 rounded hover:bg-gray-700">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 rounded hover:bg-gray-700"
                      >
                        Dashboard
                      </Link>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 rounded hover:bg-gray-700"
                    >
                      Profile
                    </Link>
                    <UserButton />
                  </SignedIn>
                </div>
              </div>
            </header>

            <header className="flex items-center justify-between px-4 py-3 bg-background shadow-sm sm:px-6 lg:px-8">
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="flex items-center space-x-2"
                >
                 <Image
                    src="/3mtt-fullcolor.png" // Replace with your logo path
                    alt="3mtt Logo"
                    width={120}
                    height={50}
                    className=""
                  />
                  {/* <span className="text-xl font-bold">
                    Skill Assessment
                  </span> */}
                </Link>
              </div>
              <div className="flex items-center gap-4 md:gap-6">
                <nav className="hidden md:flex items-center gap-4">
                  <SignedOut>
                    <SignInButton>
                      <button className="px-6 py-2 bg-white-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-300">
                        Sign In
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 rounded hover:text-blue-700 hover:font-bold"
                    >
                      Dashboard
                    </Link>
                  </SignedIn>
                </nav>
              </div>
              <UserButton />
            </header>
            {/* Main Content */}
            <main className="flex-grow lg:container lg:mx-auto px-4 py-8 ">
              {children}
              <Toaster position="top-center" richColors />
            </main>
            {/* Footer (optional) */}
            <footer className="w-full  text-black py-4 text-center">
              &copy; {new Date().getFullYear()} Career and Skill
              Assessment. All rights reserved.
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
