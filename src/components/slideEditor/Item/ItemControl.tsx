import React from 'react';

import useSlidesStore, {
  useSlidesActions,
} from '@/components/slideEditor/store';

const ItemControl = React.memo(({ itemId }: { itemId: string }) => {
  const currentSlide = useSlidesStore((state) => state.currentSlide);
  const { selectItem, deleteItem, changeZIndex } = useSlidesActions();

  const handleDelete = () => {
    selectItem(currentSlide, itemId);
    deleteItem(currentSlide);
    selectItem(currentSlide, undefined);
  };

  //TODO: rerenders twice instead of once
  const handleToFront = () => {
    selectItem(currentSlide, itemId);
    changeZIndex(currentSlide, itemId, 'top');
    selectItem(currentSlide, undefined);
  };

  const handleToBack = () => {
    selectItem(currentSlide, itemId);
    changeZIndex(currentSlide, itemId, 'bottom');
    selectItem(currentSlide, undefined);
  };

  return (
    <div
      id="item-control--wrapper"
      className="border-accent-light rounded-md border-2 w-[300px] min-w-[182px] h-10 absolute bg-primary-white -top-12 right-0 group-hover/resize:opacity-100 transition-opacity opacity-0 flex"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handleToFront}
        className="border-r border-accent-mid/50 text-xl px-4 py-1 flex-shrink-0 cursor-pointer"
      >
        To Front
      </div>
      <div
        role="button"
        tabIndex={0}
        onClick={handleToBack}
        className="border-r border-accent-mid/50 text-xl px-4 py-1 flex-shrink-0 cursor-pointer"
      >
        To Back
      </div>
      <div
        role="button"
        tabIndex={0}
        onClick={handleDelete}
        className="border-accent-mid/50 text-xl px-4 py-1 flex-shrink-0 cursor-pointer"
      >
        Delete
      </div>
    </div>
  );
});

export default ItemControl;
