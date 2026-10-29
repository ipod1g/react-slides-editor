import { useCallback, useEffect, useRef } from 'react';

import { QuillInstance } from '@/types';
import Quill from 'quill';
import type Toolbar from 'quill/modules/toolbar';

const useQuillEditor = (
  quillEditorContainer: React.RefObject<HTMLDivElement>,
  quillToolbarContainer: React.RefObject<HTMLDivElement>
) => {
  const quillInstance = useRef<QuillInstance>();

  const initQuill = useCallback(() => {
    if (quillInstance.current) return console.log('quill already initialized');
    if (typeof window !== 'undefined') {
      if (quillEditorContainer.current) {
        quillInstance.current = new Quill(quillEditorContainer.current, {
          theme: 'snow',
          modules: {
            toolbar: quillToolbarContainer.current,
          },
        }) as QuillInstance;
        (quillInstance.current.getModule('toolbar') as Toolbar)
          .addHandler('image', () => {});
      }
    }
  }, [quillEditorContainer, quillInstance, quillToolbarContainer]);

  useEffect(() => {
    initQuill();
    console.log('initQuill');
    return () => {};
  }, [initQuill]);

  return quillInstance;
};

export default useQuillEditor;
