import { FaRegImage } from 'react-icons/fa';
import { MdTextIncrease } from 'react-icons/md';

import useSlidesStore, {
  useSlidesActions,
} from '@/components/slideEditor/store';
import { IMAGE_SETS } from '@/components/slideEditor/config';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const QuillToolbar = ({
  quillToolbarContainer,
}: {
  quillToolbarContainer: React.RefObject<HTMLDivElement>;
}) => {
  //TODO: import images for this attempt

  const currentSlide = useSlidesStore((state) => state.currentSlide);
  const { addImage, addText } = useSlidesActions();

  return (
    <>
      {quillToolbarContainer && (
        <div
          ref={quillToolbarContainer}
          id="toolbar-container"
          className="bg-white"
        >
          <div className="ql-formats">
            <select className="ql-font"></select>
            {/* @ts-expect-error from defaultValue */}
            <select className="ql-header" defaultValue={false}>
              <option value="false"></option>
              <option value="1"></option>
              <option value="2"></option>
              <option value="3"></option>
            </select>
          </div>
          <span className="ql-formats">
            <button className="ql-bold"></button>
            <button className="ql-italic"></button>
            <button className="ql-underline"></button>
            <button className="ql-strike"></button>
          </span>
          <span className="ql-formats">
            <select className="ql-color"></select>
            <select className="ql-background"></select>
          </span>
          <span className="ql-formats">
            <button className="ql-script" value="sub"></button>
            <button className="ql-script" value="super"></button>
          </span>
          <span className="ql-formats">
            <button className="ql-blockquote"></button>
            <button className="ql-code-block"></button>
          </span>
          <span className="ql-formats">
            <button className="ql-list" value="ordered"></button>
            <button className="ql-list" value="bullet"></button>
            <button className="ql-indent" value="-1"></button>
            <button className="ql-indent" value="+1"></button>
          </span>
          <span className="ql-formats">
            <button className="ql-direction" value="rtl"></button>
            <select className="ql-align"></select>
          </span>
          <span className="ql-formats bg-black px-4 py-1 -my-1 rounded-lg">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      addText(currentSlide, 'Enter Text');
                    }}
                    className="text-white w-24 flex-shrink-0 mr-3"
                  >
                    <MdTextIncrease size={24} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add Textbox</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Popover>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger className="text-primary-white">
                      <FaRegImage size={20} />
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add Image</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <PopoverContent
                className="min-w-[180px] py-2 w-56"
                sideOffset={-2}
                variant={null}
              >
                <div className="grid grid-cols-2 items-center flex-col max-h-[400px] overflow-y-auto gap-1 py-4">
                  <h4 className="text-neutral-500 col-span-2 mb-4">
                    Image upload disabled <br /> due to storage usage
                  </h4>
                  {IMAGE_SETS.map((imageURL) => {
                    return (
                      <button
                        key={imageURL}
                        onClick={() => {
                          addImage(currentSlide, imageURL);
                        }}
                      >
                        <img src={imageURL} height={90} width={160} alt="" />
                      </button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </span>
          <span className="ql-formats">
            <button className="ql-clean"></button>
          </span>
          <span className="ql-formats ml-10 text-sm text-accent-mid">
            Right click item for more options
          </span>
        </div>
      )}
    </>
  );
};

export default QuillToolbar;
