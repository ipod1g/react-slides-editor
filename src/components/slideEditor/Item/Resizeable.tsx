import React, { useCallback } from 'react';
import {
  DraggableData,
  Rnd,
  RndDragCallback,
  RndResizeCallback,
} from 'react-rnd';

import {
  DEFAULT_DIMENSIONS,
  SLIDE_SCALE_RATIO,
  rndConfig,
} from '@/components/slideEditor/config';
import useSlidesStore, {
  ImageItem,
  TextItem,
  useSlidesActions,
} from '@/components/slideEditor/store';

import useDebouncedRerender from '@/components/slideEditor/useDebouncedRerender';

const Resizable = React.memo(
  ({
    children,
    item,
    idx,
    isActive,
    isThumbnail,
    lockAspectRatio,
  }: {
    children: React.ReactNode;
    item: TextItem | ImageItem;
    idx: number;
    isActive?: boolean;
    isThumbnail?: boolean;
    lockAspectRatio?: boolean;
  }) => {
    const { selectItem, updateItemPosition, updateItemSize } =
      useSlidesActions();
    const currentSlide = useSlidesStore((state) => state.currentSlide);
    const slideScale = useSlidesStore((state) => Number(state.slideScale));
    const debouncedRerender = useDebouncedRerender('rerenderThumbnail', 400);

    const prevDraggableData = React.useRef<DraggableData>();

    const handleDragStop = useCallback<RndDragCallback>(
      (e, d) => {
        if (
          prevDraggableData.current &&
          d.x === prevDraggableData.current.x &&
          d.y === prevDraggableData.current.y
        ) {
          return; // No change in d, return early
        }
        if (item.type === 'text') {
          updateItemPosition(currentSlide, 'text', d.node.id, [d.x, d.y]);
        } else {
          updateItemPosition(currentSlide, 'image', d.node.id, [d.x, d.y]);
        }

        debouncedRerender();
        prevDraggableData.current = d;
      },
      [updateItemPosition]
    );

    // TODO: introduce generic wrapper for this
    const handleResizeStop = useCallback<RndResizeCallback>(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (e, direction, ref, delta, position) => {
        updateItemSize(currentSlide, ref.id, [
          ref.offsetWidth,
          ref.offsetHeight,
        ]);
        debouncedRerender();
      },
      [updateItemSize]
    );

    return (
      <Rnd
        key={item?.id}
        scale={isThumbnail ? Number(SLIDE_SCALE_RATIO) : slideScale}
        // style={{ zIndex: idx }}
        id={item?.id}
        disableDragging={isActive}
        default={{
          width: item.size?.[0] ?? DEFAULT_DIMENSIONS.width,
          height: item.size?.[1] ?? DEFAULT_DIMENSIONS.height,
          x: item.position?.[0] ?? DEFAULT_DIMENSIONS.x,
          y: item.position?.[1] ?? DEFAULT_DIMENSIONS.y,
        }}
        // onDragStop={handleDragStop}
        // onResizeStop={handleResizeStop}
        // onContextMenu={() => {
        //   selectItem(currentSlide, item.id);
        // }}
        onDoubleClick={() => {
          selectItem(currentSlide, item.id);
        }}
        lockAspectRatio={lockAspectRatio}
        {...rndConfig}
      >
        {children}
      </Rnd>
    );
  }
);

export default Resizable;
