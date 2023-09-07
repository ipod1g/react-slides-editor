import { memo, useCallback, useRef } from 'react';
import { AnimatePresence, Reorder } from 'framer-motion';
import { cn } from '@/lib/utils';

import useSlidesStore, {
  useSlidesActions,
} from '@/components/slideEditor/store';
import { useScrollZoom } from '@/components/slideEditor/useScrollZoom';
import useQuillEditor from '@/components/slideEditor/Quill/useQuillEditor';

import { MdOutlineAdd } from 'react-icons/md';
import { BottomPanel, TopPanel } from '@/components/slideEditor/panels';
import QuillToolbar from '@/components/slideEditor/Quill/Toolbar';
import QuillWrapper from '@/components/slideEditor/Quill/QuillWrapper';
import Slide from '@/components/slideEditor/Slide';

import {
  MAX_NO_OF_SLIDES,
  SLIDE_SCALE_RATIO_STEP,
} from '@/components/slideEditor/config';

const Editor = () => {
  const { setCurrentSlide, setSlides } = useSlidesActions();
  const currentSlide = useSlidesStore((state) => state.currentSlide);
  const slides = useSlidesStore((state) => state.slides);

  const { activateScrollZoom, deactivateScrollZoom } = useScrollZoom(
    SLIDE_SCALE_RATIO_STEP
  );

  const quillToolbarContainer = useRef<HTMLDivElement>(null);
  const quillEditorContainer = useRef<HTMLDivElement>(null);
  const quillEditorContainerTempHolder = useRef<HTMLDivElement>(null);

  const quillInstance = useQuillEditor(
    quillEditorContainer,
    quillToolbarContainer
  );

  const handleSlideChange = useCallback((slideIndex: number) => {
    setCurrentSlide(slideIndex);
  }, []);

  return (
    <div className="h-full w-full bg-accent-light/80 flex flex-col overflow-hidden">
      {/* <TopPanel /> */}
      <QuillWrapper
        quillEditorContainer={quillEditorContainer}
        ref={quillEditorContainerTempHolder}
      >
        <QuillToolbar quillToolbarContainer={quillToolbarContainer} />
        <div className="h-full overflow-hidden mx-auto">
          <div
            className={`h-full relative flex justify-center items-center`}
            onMouseEnter={activateScrollZoom}
            onMouseLeave={deactivateScrollZoom}
          >
            {slides.map(
              (_, index) =>
                index === currentSlide && (
                  <Slide
                    key={index}
                    currentSlideIndex={index}
                    quillInstance={quillInstance}
                    quillEditorContainer={quillEditorContainer}
                    quillEditorContainerTempHolder={
                      quillEditorContainerTempHolder
                    }
                  />
                )
            )}
          </div>
        </div>
      </QuillWrapper>
      <BottomPanel>
        <Reorder.Group
          className="flex gap-4 w-full justify-start items-center"
          as="ul"
          axis="x"
          values={slides}
          onReorder={setSlides}
          layoutScroll
          style={{ overflowX: 'auto' }}
        >
          <AnimatePresence initial={false}>
            {slides.map((slide, i) => (
              <Reorder.Item
                className="relative"
                key={'thumbnail-' + slide.id}
                value={slide}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.15 },
                }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                {/* <SlideThumbnail
                  key={i}
                  index={i}
                  onClick={() => handleSlideChange(i)}
                /> */}
              </Reorder.Item>
            ))}
          </AnimatePresence>
          <AddSlide
            slideLength={slides?.length}
            setCurrentSlide={handleSlideChange}
          />
        </Reorder.Group>
      </BottomPanel>
    </div>
  );
};

export default Editor;

const AddSlide = memo(
  ({
    slideLength,
    setCurrentSlide,
  }: {
    slideLength: number;
    setCurrentSlide: (idx: number) => void;
  }) => {
    const { addSlide } = useSlidesActions();

    const handleAddSlide = useCallback(() => {
      addSlide();
      setCurrentSlide(slideLength);
    }, [slideLength]);

    return (
      <>
        {slideLength < MAX_NO_OF_SLIDES && (
          <button
            onClick={handleAddSlide}
            className={cn(
              'bg-accent-light hover:bg-accent-light/70 text-accent-dark hover:text-primary-blue transition-colors flex justify-center items-center flex-shrink-0 w-28 h-auto aspect-[16/9] border-accent-light rounded-xl overflow-hidden border-2 relative'
            )}
          >
            <MdOutlineAdd size={30} />
          </button>
        )}
      </>
    );
  }
);
