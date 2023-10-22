import React, { useCallback, useEffect, useRef } from 'react';

import { TextItem } from '@/components/slideEditor/store';
import { stripEscapeDoubleQuotes } from '@/components/slideEditor/functions';

type RichTextBox = {
  editable: TextItem | undefined;
  quillEditorContainer: React.RefObject<HTMLDivElement>;
  onChangeActive: (editable: TextItem | undefined, activate: boolean) => void;
  isActive: boolean;
  isThumbnail?: boolean;
};

const RichTextBox = ({
  editable,
  quillEditorContainer,
  onChangeActive,
  isActive,
  isThumbnail,
}: RichTextBox) => {
  const content = editable?.content ?? '';

  /** Displays content when the editor is not active */
  const contentEl = useRef<HTMLDivElement>(null);

  /** Contains the quill editor element when it is active RichTextBox */
  const quillEditorParent = useRef<HTMLDivElement>(null);

  const activate = useCallback(
    (active: boolean) => {
      onChangeActive(editable, active);
    },
    [onChangeActive, editable]
  );

  /**
   * When prop isActive is true, detach the quill editor element
   * from the temporary container of App, moving it to actual container for it.
   * Also, toggle the visibility of contentEl and quillEditorParent
   */
  useEffect(() => {
    if (!quillEditorParent.current || !contentEl.current) return;

    if (isActive && quillEditorContainer.current) {
      quillEditorParent.current.appendChild(quillEditorContainer.current);
    }

    if (isThumbnail) return;
    quillEditorParent.current.style.display = isActive ? 'block' : 'none';
    contentEl.current.style.display = isActive ? 'none' : 'block';
  }, [isActive, isThumbnail, quillEditorContainer]);

  useEffect(() => {
    if (isActive) {
      const onKeyUp = (e: KeyboardEvent) => {
        if (e.code === 'Escape') {
          activate(false);
        }
      };

      document.addEventListener('keyup', onKeyUp);
      return () => document.removeEventListener('keyup', onKeyUp);
    }
  }, [isActive, activate, editable]);

  // Set the contents of my contentEl when it changes
  // and for better user mouse hover experience - TODO: doesnt apply on initial addText
  useEffect(() => {
    if (contentEl.current) {
      try {
        contentEl.current.innerHTML = stripEscapeDoubleQuotes(
          JSON.parse(content)
        ).toString(); // might not need toString
      } catch (err) {
        console.error(err);
      }

      const firstLayerChildren = Array.from(
        contentEl.current.children
      ) as HTMLElement[];

      firstLayerChildren.forEach((child) => {
        child.classList?.add('cursor-text');
      });
      return () => {
        firstLayerChildren.forEach((child) => {
          child.classList?.remove('cursor-text');
        });
      };
    }
  }, [content, isActive]);

  return (
    <div
      className="h-full relative flex-grow basis-0 overflow-hidden"
      id={editable?.id}
      onDoubleClick={() => activate(true)}
      onContextMenu={() => activate(true)}
    >
      <div
        className="absolute inset-0 p-4 hidden bg-transparent z-40 select-text cursor-text"
        ref={quillEditorParent}
      ></div>
      <div className="ql-container ql-snow" style={{ border: 'none' }}>
        <div
          className="ql-editor cursor-default absolute inset-0 p-4 w-full h-full break-words bg-transparent"
          ref={contentEl}
        ></div>
      </div>
    </div>
  );
};

export default RichTextBox;
