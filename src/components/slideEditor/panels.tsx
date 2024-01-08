import { FormEvent, useState } from 'react';
import { useSlidesActions } from '@/components/slideEditor/store';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { INITIAL_SLIDE } from './initial';

export const BottomPanel = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const { setSlides } = useSlidesActions();

  const resetSlides = async (e: FormEvent) => {
    e.preventDefault();
    setOpen(false);
    // setSlides(Array(0));
    setSlides([INITIAL_SLIDE]);
  };

  return (
    <div className="bg-white w-full h-32 flex flex-shrink-0 border-t-2 border-accent-light/50">
      <div className="w-full h-full py-4 px-4 overflow-hidden">{children}</div>
      <div className="w-[164px] px-2 border-l-2 h-full flex flex-shrink-0">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="bg-neutral-950 text-white rounded-full mx-auto hover:cursor-pointer w-36 h-12 relative my-auto">
              Reset All
            </button>
          </DialogTrigger>
          {/* change to loading after confirm */}
          <DialogContent className="px-12 py-6 rounded-lg shadow-lg border-2 border-accent-light flex flex-col gap-6 max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-lg">
                Are you absolutely sure?
              </DialogTitle>
              <DialogDescription className="text-accent-dark">
                You cannot retrieve your previous slides
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogPrimitive.Close className="border-2 border-neutral-950 px-6 py-2 rounded-full">
                <span className="">Close</span>
              </DialogPrimitive.Close>
              <button
                onClick={resetSlides}
                type="submit"
                className="bg-neutral-950 px-6 py-2 text-white rounded-full relative"
              >
                Confirm
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
