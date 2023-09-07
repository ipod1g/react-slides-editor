import { forwardRef, useRef } from 'react';

type QuillWrapperProps = {
  quillEditorContainer: React.RefObject<HTMLDivElement>;
  children?: React.ReactNode;
};

/** Needed as a wrapper to have a single toolbar for multiple quill editor instances */
const QuillWrapper = forwardRef<HTMLDivElement, QuillWrapperProps>(
  ({ quillEditorContainer, children }, ref) => {
    const quillEditorContainerTempHolder = useRef<HTMLDivElement>(null);

    if (ref && 'current' in ref) {
      ref.current = quillEditorContainerTempHolder.current;
    }

    return (
      <>
        {children}
        <div
          id="temp-holder"
          className="fixed top-0 invisible"
          ref={quillEditorContainerTempHolder}
        >
          <div ref={quillEditorContainer} className="absolute inset-0"></div>
        </div>
      </>
    );
  }
);

export default QuillWrapper;
