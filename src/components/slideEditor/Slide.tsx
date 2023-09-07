import React, { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash';

import useSlidesStore, {
  TextItem,
  ImageItem,
  useSlidesActions,
} from '@/components/slideEditor/store';

import { QuillInstance } from '@/types';
import {
  escapeDoubleQuotes,
  stripEscapeDoubleQuotes,
} from '@/components/slideEditor/functions';
import { SLIDE_THUMBNAIL_SCALE } from '@/components/slideEditor/config';

import RichTextBox from '@/components/slideEditor/Item/RichTextBox';
import Resizeable from '@/components/slideEditor/Item/Resizeable';
import ItemContextMenu from '@/components/slideEditor/Item/ItemContextMenu';
import ItemControl from '@/components/slideEditor/Item/ItemControl';

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
    const slide = useSlidesStore((state) => state.slides[currentSlideIndex]);

    const [memoizedItems, setMemoizedItems] = useState<
      Array<TextItem | ImageItem>
    >([]);

    useEffect(() => {
      if (!slide?.items) return;
      if (memoizedItems.length != slide.items.length) {
        return setMemoizedItems(slide.items);
      }

      if (JSON.stringify(slide.items) === JSON.stringify(memoizedItems)) return;
      for (let i = 0; i < slide.items.length; i++) {
        const textItem = slide.items[i] as TextItem;
        const memoizedTextItem = memoizedItems[i] as TextItem;

        // recognize order change and update memoizedItems
        setMemoizedItems((prevItems) =>
          prevItems.map((item, index) => {
            return index !== i ? item : slide.items[i];
          })
        );

        if (slide.items[i].type !== 'text') continue;
        if (textItem.content !== memoizedTextItem.content) {
          // recognize text change and update memoizedItems
          setMemoizedItems((prevItems) =>
            prevItems.map((item, index) => {
              return index !== i
                ? item
                : { ...item, content: textItem.content };
            })
          );
          return;
        }
      }
    }, [slide, memoizedItems]);

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
          // @ts-expect-error quill typings
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
          className="h-[900px] w-[1600px] flex-shrink-0 bg-white overflow-clip"
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
          {memoizedItems.map((item, idx) => (
            <MItem
              isThumbnail={isThumbnail}
              key={'item-' + item.id + idx}
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

const MItem = React.memo(
  ({
    item,
    idx,
    setEditableActiveStatus,
    quillEditorContainer,
    selectedItem,
    isThumbnail,
  }: {
    item: TextItem | ImageItem;
    idx: number;
    setEditableActiveStatus: (
      editable: TextItem | undefined,
      activate: boolean
    ) => void;
    quillEditorContainer: React.RefObject<HTMLDivElement>;
    selectedItem: TextItem | ImageItem | undefined;
    isThumbnail?: boolean;
  }) => {
    // console.log(idx, item);

    return (
      <React.Fragment key={'item-' + item.id}>
        {item.type === 'text' ? (
          <Resizeable
            item={item}
            isThumbnail={isThumbnail}
            idx={idx}
            isActive={selectedItem?.id === item.id}
          >
            <ItemContextMenu>
              <ItemControl itemId={item.id} />
              <RichTextBox
                isThumbnail={isThumbnail}
                editable={item}
                onChangeActive={setEditableActiveStatus}
                quillEditorContainer={quillEditorContainer}
                isActive={selectedItem?.id === item.id}
              />
            </ItemContextMenu>
          </Resizeable>
        ) : (
          <Resizeable
            item={item}
            isThumbnail={isThumbnail}
            idx={idx}
            // lockAspectRatio
          >
            <ItemContextMenu>
              <ItemControl itemId={item.id} />
              <img
                id={item.id}
                src={item.url}
                alt={`image-${item.id}`}
                className="h-full w-full object-fill"
              />
            </ItemContextMenu>
          </Resizeable>
        )}
      </React.Fragment>
    );
  }
);
