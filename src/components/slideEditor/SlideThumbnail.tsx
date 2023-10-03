import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

import useProposalStore from '@/components/slideEditor/store';

import { QuillInstance } from '@/types';

import Slide from '@/components/slideEditor/Slide';
import ThumbnailContextMenuWrapper from '@/components/slideEditor/ThumbnailContextMenuWrapper';

interface SlideThumbnailProps {
  index: number;
  onClick: () => void;
}

/** TODO: Slide ratio seems cut off */
const SlideThumbnail = React.memo(({ index, onClick }: SlideThumbnailProps) => {
  const currentSlide = useProposalStore((state) => state.currentSlide);
  const rerenderThumbnail = useProposalStore(
    (state) => state.rerenderThumbnail
  );

  // Refs for cloning the slide
  const cloneRef1 = useRef<QuillInstance | undefined>();
  const cloneRef2 = useRef<HTMLDivElement>(null);
  const cloneRef3 = useRef<HTMLDivElement>(null);

  return (
    <ThumbnailContextMenuWrapper index={index}>
      <motion.button
        key={index}
        onClick={onClick}
        className={cn(
          'bg-accent-light hover:border-accent-mid/40 w-28 h-auto aspect-[16/9] border-accent-light overflow-clip rounded-xl border-2',
          {
            'border-accent-dark/70 hover:border-accent-dark/70':
              currentSlide === index,
          }
        )}
      >
        {/* To make sure only the current slide rerenders */}
        {React.cloneElement(
          <div className="scale-[.08] pointer-events-none relative -top-[36px] -left-[58px]">
            <Slide
              currentSlideIndex={index}
              quillInstance={cloneRef1}
              quillEditorContainer={cloneRef2}
              quillEditorContainerTempHolder={cloneRef3}
              isThumbnail
            />
          </div>,
          {
            key: currentSlide === index ? rerenderThumbnail : index,
          }
        )}
      </motion.button>
    </ThumbnailContextMenuWrapper>
  );
});

export default SlideThumbnail;
