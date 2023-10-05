import React, { useCallback } from 'react';
import {
  DraggableData,
  Rnd,
  RndDragCallback,
  RndResizeCallback,
} from 'react-rnd';

import {
  DEFAULT_DIMENSIONS,
  DRAG_GRID_SNAP,
  RESIZE_GRID_SNAP,
  RESIZING_DISABLED,
  RESIZING_ENABLED,
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
      (_e, d) => {
        // No change in d, return early
        if (
          prevDraggableData.current &&
          d.x === prevDraggableData.current.x &&
          d.y === prevDraggableData.current.y
        )
          return;

        updateItemPosition(currentSlide, d.node.id, [d.x, d.y]);
        debouncedRerender();
        prevDraggableData.current = d;
      },
      [updateItemPosition, debouncedRerender, currentSlide]
    );

    const handleResizeStop = useCallback<RndResizeCallback>(
      (_e, _direction, ref) => {
        updateItemSize(currentSlide, ref.id, [
          ref.offsetWidth,
          ref.offsetHeight,
        ]);
        debouncedRerender();
      },
      [updateItemSize, debouncedRerender, currentSlide]
    );

    return (
      <Rnd
        key={item?.id}
        scale={isThumbnail ? Number(SLIDE_SCALE_RATIO) : slideScale}
        style={{ zIndex: idx }}
        id={item?.id}
        disableDragging={isActive || item.permission === 'view'}
        enableResizing={
          item.permission === 'view' ? RESIZING_DISABLED : RESIZING_ENABLED
        }
        resizeGrid={RESIZE_GRID_SNAP}
        dragGrid={DRAG_GRID_SNAP}
        default={{
          width: item.size?.[0] ?? DEFAULT_DIMENSIONS.width,
          height: item.size?.[1] ?? DEFAULT_DIMENSIONS.height,
          x: item.position?.[0] ?? DEFAULT_DIMENSIONS.x,
          y: item.position?.[1] ?? DEFAULT_DIMENSIONS.y,
        }}
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        onContextMenu={() => {
          selectItem(currentSlide, item.id);
        }}
        onDoubleClick={() => {
          if (item.permission === 'view') return;
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
