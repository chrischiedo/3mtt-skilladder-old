import { CheckIcon, MoveRight, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export const SectionBlock = ({ title, description, image }: { title?: any; description?: any; image?: any } = {}) => (
  <div className="w-full  py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="grid grid-cols-1 gap-6  lg:grid-cols-2">
        <div className="flex gap-4 flex-col">
          <div className="flex gap-4 flex-col">
            <h1 className="text-4xl md:text-7xl max-w-lg tracking-tighter text-left font-regular">
              Assessment Steps
            </h1>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <CheckIcon className="w-8 h-8" />
                <p className="text-3xl leading-relaxed tracking-tight text-muted-foreground max-w-md text-left">
                  Course Selection
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="w-8 h-8" />
                <p className="text-3xl leading-relaxed tracking-tight text-muted-foreground max-w-md text-left">
                  Skill Extraction
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="w-8 h-8" />
                <p className="text-3xl leading-relaxed tracking-tight text-muted-foreground max-w-md text-left">
                  Self-Assessment
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="w-8 h-8" />
                <p className="text-3xl leading-relaxed tracking-tight text-muted-foreground max-w-md text-left">
                  Technical Assessment
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="w-8 h-8" />
                <p className="text-3xl leading-relaxed tracking-tight text-muted-foreground max-w-md text-left">
                  Professional Capability Assessment
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="w-8 h-8" />
                <p className="text-3xl leading-relaxed tracking-tight text-muted-foreground max-w-md text-left">
                  Try RIASEC
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="w-8 h-8" />
                <p className="text-3xl leading-relaxed tracking-tight text-muted-foreground max-w-md text-left">
                  Final Evaluation
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className=" grid grid-cols-2 gap-8">
          <div className="relative bg-muted rounded-md aspect-square">
            <Image
              src={'/steps1.png'}
              alt="Section image"
              layout="fill"
              objectFit="contain"
              className="w-64 h-64 rounded-lg "
            />
          </div>
          <div className="relative bg-muted rounded-md row-span-2">
            <Image
              src={'/steps.png'}
              alt="Section image"
              layout="fill"
              objectFit="contain"
              className="w-64 h-64 rounded-lg"
            />
          </div>
          <div className="relative bg-muted rounded-md aspect-square">
            <Image
              src={'/bg-image.png'}
              alt="Section image"
              layout="fill"
              objectFit="cover"
              className="w-64 h-64 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
