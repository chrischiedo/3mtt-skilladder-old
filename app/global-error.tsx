"use client";

// import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    // Sentry.captureException(error);
    console.log("err",error)
  }, [error]);

  return (
    <html>
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        {/* <NextError statusCode={0} /> */}
        <div>
          <h1 className="text-gray-700">Something went wrong. Kindly try that again.</h1>
          <Link href="/dashboard">
            <a>Go to Dashboard</a>
          </Link>
        </div>

      </body>
    </html>
  );
}