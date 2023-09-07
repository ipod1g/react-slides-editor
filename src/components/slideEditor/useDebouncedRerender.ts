import { debounce } from 'lodash';
import { useSlidesActions } from '@/components/slideEditor/store';

const useDebouncedRerender = (
  target: 'rerenderSlide' | 'rerenderThumbnail',
  time?: number
) => {
  const { forceRerender } = useSlidesActions();
  const debouncedRerender = debounce(() => forceRerender(target), time ?? 300);

  return debouncedRerender;
};

export default useDebouncedRerender;
