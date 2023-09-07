import { useEffect, useCallback, useRef } from 'react';

import {
  SLIDE_SCALE_RATIO_MAX,
  SLIDE_SCALE_RATIO_MIN,
} from '@/components/slideEditor/config';

import useSlidesStore, {
  useSlidesActions,
} from '@/components/slideEditor/store';

export const useScrollZoom = (modifier: number = 0.01) => {
  const slideScale = useSlidesStore((state) => state.slideScale);
  const { changeScale } = useSlidesActions();
  const isScrollZoomActiveRef = useRef<boolean>(false);

  const handleScrollEvent = useCallback(
    (e: WheelEvent) => {
      if (!isScrollZoomActiveRef.current) return;
      const newScrollY = Number(slideScale) + e.deltaY * -1 * modifier;
      const newScale = Math.min(
        Math.max(newScrollY, SLIDE_SCALE_RATIO_MIN),
        SLIDE_SCALE_RATIO_MAX
      );
      changeScale(newScale.toString());
    },
    [slideScale]
  );

  useEffect(() => {
    const scrollListener = (e: WheelEvent) => {
      handleScrollEvent(e);
    };
    window.addEventListener('wheel', scrollListener);
    return () => {
      window.removeEventListener('wheel', scrollListener);
    };
  }, [handleScrollEvent, slideScale]);

  const activateScrollZoom = useCallback(() => {
    isScrollZoomActiveRef.current = true;
  }, []);

  const deactivateScrollZoom = useCallback(() => {
    isScrollZoomActiveRef.current = false;
  }, []);

  return { activateScrollZoom, deactivateScrollZoom };
};
