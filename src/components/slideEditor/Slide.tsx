import React, { useCallback, useEffect } from 'react';
import { debounce } from 'lodash';

import useSlidesStore, {
  TextItem,
  useSlidesActions,
} from '@/components/slideEditor/store';

import { QuillInstance } from '@/types';
import {
  escapeDoubleQuotes,
  stripEscapeDoubleQuotes,
} from '@/components/slideEditor/functions';
import { SLIDE_THUMBNAIL_SCALE } from '@/components/slideEditor/config';

import Item from '@/components/slideEditor/Item/';

interface SlideProps {
  currentSlideIndex: number;
  quillEditorContainer: React.RefObject<HTMLDivElement>;
  quillInstance: React.MutableRefObject<QuillInstance | undefined>;
  quillEditorContainerTempHolder: React.RefObject<HTMLDivElement>;
  isThumbnail?: boolean;
}

const Slide = React.memo(
  ({
    currentSlideIndex,
    quillEditorContainer,
    quillInstance,
    quillEditorContainerTempHolder,
    isThumbnail,
  }: SlideProps) => {
    const { updateText, selectItem } = useSlidesActions();
    const selectedItem = useSlidesStore((state) => state.selectedItem);
    const slideScale = useSlidesStore((state) => state.slideScale);
    const slide = useSlidesStore(
      (state) => state.slides[currentSlideIndex],
      // if false, rerenders
      (prev, next) => {
        // nothing changed
        if (JSON.stringify(prev) === JSON.stringify(next)) return true;
        return false;
      }
    );

    /** Listens to quill api */
    useEffect(() => {
      if (quillInstance.current && selectedItem) {
        const quill = quillInstance.current || {};
        const onTextChange = () => {
          if (!quill.container.firstElementChild?.innerHTML || !selectedItem)
            return console.error('no content');

          const data = escapeDoubleQuotes(
            quill.container.firstElementChild.innerHTML
          );

          updateText(currentSlideIndex, JSON.stringify(data));
        };

        const debouncedTextChange = debounce(onTextChange, 200);

        quill.on('text-change', debouncedTextChange);
        return () => {
          quill.off('text-change', debouncedTextChange);
        };
      }
      return () => {};
    }, [quillInstance, selectedItem, updateText]);

    const setEditableActiveStatus = useCallback(
      (editable: TextItem | undefined, activate: boolean) => {
        if (!quillEditorContainer.current) return console.log('no container');
        const quill = quillInstance.current;

        if (activate && quill && editable?.content) {
          const content = stripEscapeDoubleQuotes(JSON.parse(editable.content));
          // @ts-expect-error quill typings on content
          const delta = quill.clipboard.convert(content);
          quill.setContents(delta, 'silent');

          setTimeout(() => {
            quill.setSelection(
              { index: 0, length: quill.getLength() - 1 },
              'api'
            );
          });

          selectItem(currentSlideIndex, editable.id);
        } else {
          quillEditorContainer.current?.remove();
          quillEditorContainerTempHolder.current?.appendChild(
            quillEditorContainer.current ?? null
          );
          selectItem(currentSlideIndex, undefined);
        }
      },
      []
    );

    // TODO: find a way to get scale from screensize when adding responsiveness
    return (
      <>
        <div
          id="buffer-area-outer"
          onMouseUp={() => {
            setEditableActiveStatus(
              selectedItem?.type === 'text' ? selectedItem : undefined,
              false
            );
          }}
          className="w-full h-full absolute"
        />
        <div
          id={`slide-${currentSlideIndex}`}
          style={{
            scale: isThumbnail ? SLIDE_THUMBNAIL_SCALE : slideScale,
          }}
          className="h-[900px] w-[1600px] absolute flex-shrink-0 bg-white overflow-clip"
        >
          <div
            id="buffer-area-inner"
            onMouseUp={() => {
              setEditableActiveStatus(
                selectedItem?.type === 'text' ? selectedItem : undefined,
                false
              );
            }}
            className="w-full h-full absolute"
          />
          {slide?.items.map((item, idx) => (
            <Item
              isThumbnail={isThumbnail}
              key={'item-' + item.id}
              item={item}
              idx={idx}
              setEditableActiveStatus={setEditableActiveStatus}
              quillEditorContainer={quillEditorContainer}
              selectedItem={selectedItem}
            />
          ))}
        </div>
      </>
    );
  }
);

export default Slide;
