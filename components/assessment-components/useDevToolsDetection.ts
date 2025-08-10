'use client';
import { useEffect } from 'react';
import { toast } from 'sonner';

const useDevToolsDetection = (onDevToolsOpen: () => void): void => {
  useEffect(() => {
    let warningCount = 0;
    const MAX_WARNINGS = 3;

    // Function to handle developer tools detection
    const handleDevTools = (): void => {
      warningCount++;
      if (warningCount <= MAX_WARNINGS) {
        toast.warning(
          `Warning ${warningCount}/${MAX_WARNINGS}: Developer tools detected. Please close them to continue the assessment.`,
          {
            duration: 4000,
            position: 'top-center',
          }
        );
      } else {
        onDevToolsOpen();
      }
    };

    // Check for developer tools by window size difference
    const checkDevTools = (): void => {
      const threshold = 100;
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        handleDevTools();
      }
    };

    // Prevent keyboard shortcuts
    const preventDevTools = (e: KeyboardEvent): void => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        handleDevTools();
      }
    };

    // Set up interval to check window size
    const interval = setInterval(checkDevTools, 1000);

    // Add keyboard event listener
    window.addEventListener('keydown', preventDevTools);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', preventDevTools);
    };
  }, [onDevToolsOpen]);
};

export default useDevToolsDetection;
