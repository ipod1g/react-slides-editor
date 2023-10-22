import { FormEvent, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

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

export const TopPanel = () => {
  const timeRef = useRef<string>();
  const { forceRerender } = useSlidesActions();

  function addTemplate() {
    // setSlides(template);
    forceRerender('rerenderSlide');
  }

  return (
    <div className="bg-gradient-blue h-10 flex-shrink-0 w-full flex justify-between items-center text-white px-8">
      <h1>
        <span className="font-bold">Untitled design</span> - Presentation Draft
      </h1>
      <h3 className="text-sm text-white/70">Auto saved {timeRef.current}</h3>
      <button
        onClick={() => addTemplate()}
        className="border-2 border-accent-mid px-3 py-1 rounded-2xl bg-purple-200 font-bold text-black"
      >
        Reset back to template
      </button>
    </div>
  );
};

export const BottomPanel = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [isPdfProcessing, setIsPdfProcessing] = useState(false);

  const downloadPdf = async (e: FormEvent) => {
    e.preventDefault();
    setOpen(false);
    setIsPdfProcessing(true);
  };

  return (
    <div className="bg-white w-full h-32 flex flex-shrink-0 border-t-2 border-accent-light/50">
      <div className="w-full h-full py-4 px-4 overflow-hidden">{children}</div>
      <div className="w-[164px] px-2 border-l-2 h-full flex flex-shrink-0">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              className="mx-auto hover:cursor-pointer w-36 h-10 mt-3 font-bold relative mr-12"
              disabled={isPdfProcessing}
            >
              Submit
            </button>
          </DialogTrigger>
          {/* change to loading after confirm */}
          <DialogContent className="px-12 py-6 rounded-lg shadow-lg border-2 border-accent-light flex flex-col gap-6 max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-lg">
                Are you absolutely sure?
              </DialogTitle>
              <DialogDescription className="text-accent-dark">
                You cannot edit the proposal after submitting
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogPrimitive.Close
                disabled={isPdfProcessing}
                className="border-2 border-purple-950 px-6 py-2 rounded-full"
              >
                <span className="">Close</span>
              </DialogPrimitive.Close>
              <button
                onClick={downloadPdf}
                type="submit"
                disabled={isPdfProcessing}
                className="bg-purple-950 px-6 py-2 text-white rounded-full relative disabled:opacity-90"
              >
                <div
                  className={cn(
                    'invisible absolute left-1/2 -translate-x-1/2 mt-1',
                    {
                      visible: isPdfProcessing,
                    }
                  )}
                >
                  Submitting
                  {/* <BlobUp /> */}
                </div>
                <span
                  className={cn('visible', {
                    invisible: isPdfProcessing,
                  })}
                >
                  Confirm
                </span>
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
