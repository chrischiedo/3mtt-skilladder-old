import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CheckIcon } from "lucide-react";
import React from "react";
import Link from "next/link";

interface StepNavigationProps {
  isOpen: boolean;
  showGoToDashboardButton?: boolean;
  title: string;
  subtitle: string;
  onNext?: () => void;
  nextButtonText?: string;
  nextButtonHref: string;
  children?: React.ReactNode;
}

export function StepNavigation({
  isOpen,
  showGoToDashboardButton = true,
  title,
  subtitle,
  onNext,
  nextButtonText = "Proceed to Next Step",
  nextButtonHref,
  children
}: StepNavigationProps) {
  const router = useRouter();

  const handleClose = () => {
    router.push("/dashboard");
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-screen h-screen " side={"bottom"}>
       

        
        <div className="flex flex-col gap-4 mt-8 lg:max-w-2xl mx-auto">
          <div className="flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
              <CheckIcon className="w-16 h-16 text-white" />
            </div>
            <p className="ml-2 text-3xl font-semibold gradient-text mt-4">{title}</p>
          </div>
          <p className="text-center mt-4">
           {subtitle}
          </p>
          <Link href={nextButtonHref || "#"}>
            <Button size="lg" className="mt-4 text-base bg-blue-600 w-full">
              {nextButtonText}
            </Button>
          </Link>
          {showGoToDashboardButton &&
           <Button onClick={handleClose} variant="outline" size="lg" className="mt-4 text-base w-full">
            Back to Dashboard
          </Button>
          }
          
        </div>

       
          {children}

        
      </SheetContent>
    </Sheet>
  );
} 