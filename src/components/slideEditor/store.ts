import { produce } from 'immer';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

interface SlideItem {
  id: string;
  position: [number, number];
  size: [number, number];
  type: 'text' | 'image';
  permission?: boolean;
}
export interface TextItem extends SlideItem {
  content: string;
  // discriminating property for type inference
  type: 'text';
}

export interface ImageItem extends SlideItem {
  url: string;
  type: 'image';
}
export interface Slide {
  id: number; // order?
  _id: string;
  items: (TextItem | ImageItem)[];
}

interface StoreModel {
  slides: Slide[];
  currentSlide: number;
  selectedItem: TextItem | ImageItem | undefined;
  rerenderSlide: 'true' | 'false'; // hack to force rerender - string because of key type
  rerenderThumbnail: 'true' | 'false'; // hack to force rerender - string because of key type
  slideScale: string;
  actions: {
    setSlides: (slideArray: Slide[]) => void;
    setCurrentSlide: (slide: number) => void;
    updateItemPosition: (
      slideIndex: number,
      itemId: string,
      position: [number, number]
    ) => void;
    updateItemSize: (
      slideIndex: number,
      itemId: string,
      size: [number, number]
    ) => void;
    setThumbnail: (slideIndex: number, thumbnailUrl: string) => void;
    updateText: (
      slideIndex: number,
      newValue: string | number | boolean | 'normal' | 'bold'
    ) => void;
    selectItem: (slideIndex: number, itemId: string | undefined) => void;
    addImage: (slideIndex: number, imageUrl: string) => void;
    addText: (slideIndex: number, text: string) => void;
    deleteItem: (slideIndex: number) => void;
    changeZIndex: (
      slideIndex: number,
      itemId: string,
      modifier: 'top' | 'bottom'
    ) => void;

    forceRerender: (target: 'rerenderSlide' | 'rerenderThumbnail') => void;
    addSlide: (template?: unknown[]) => void;
    deleteSlide: (slideIndex: number) => void;
    changeScale: (scale: string) => void;
  };
}

const useSlidesStore = createWithEqualityFn<StoreModel>()(
  devtools(
    persist(
      (set, get) => ({
        slides: [],
        currentSlide: 0,
        selectedItem: undefined,
        rerenderThumbnail: 'false',
        rerenderSlide: 'false',
        slideScale: '0.6',
        actions: {
          setSlides: (slideArray: Slide[]) => {
            set(
              produce((state) => {
                state.slides = slideArray;
              })
            );
          },
          setCurrentSlide: (slide) => {
            set(
              produce((state) => {
                state.currentSlide = slide;
              })
            );
          },
          updateItemPosition: (slideIndex, itemId, position) =>
            set(
              produce((state) => {
                const slide = state.slides[slideIndex];
                const itemIndex = slide.items.findIndex(
                  (obj: ImageItem | TextItem) => obj.id === itemId
                );
                if (itemIndex > -1) {
                  slide.items[itemIndex].position = position;
                }
              })
            ),
          updateItemSize: (slideIndex, itemId, size) =>
            set(
              produce((state) => {
                const slide = state.slides[slideIndex];
                const itemIndex = slide.items.findIndex(
                  (obj: ImageItem | TextItem) => obj.id === itemId
                );
                if (itemIndex > -1) {
                  slide.items[itemIndex].size = size;
                }
              })
            ),
          setThumbnail: (slideIndex, thumbnailUrl) =>
            set(
              produce((state) => {
                state.slides[slideIndex].thumbnailUrl = thumbnailUrl;
              })
            ),
          updateText: (slideIndex, newValue) =>
            set(
              produce((state) => {
                const slide = state.slides[slideIndex];
                if (state.selectedItem) {
                  const itemIndex = slide.items.findIndex(
                    (obj: ImageItem | TextItem) =>
                      obj.id === state.selectedItem.id
                  );
                  state.slides[slideIndex].items[itemIndex].content = newValue;
                }
              })
            ),
          selectItem: (slideIndex, itemId) =>
            set(
              produce((state) => {
                const slide = state.slides[slideIndex];
                const item = slide.items.find(
                  (obj: ImageItem | TextItem) => obj.id === itemId
                );
                if (item) {
                  state.selectedItem = item;
                } else {
                  state.selectedItem = null;
                }
              })
            ),
          addImage: (slideIndex, imageUrl) =>
            set(
              produce((state) => {
                const slide = state.slides[slideIndex];
                const newItem = {
                  id: Math.random().toString(36).substr(2, 9),
                  position: [10, 10],
                  size: [400, 400],
                  type: 'image',
                  url: imageUrl,
                };
                slide.items = [...slide.items, newItem];
              })
            ),
          addText: (slideIndex, text) =>
            set(
              produce((state) => {
                const slide = state.slides[slideIndex];
                const newItem = {
                  id: Math.random().toString(36).substr(2, 9),
                  position: [50, 50],
                  size: [200, 200],
                  type: 'text',
                  content: '"Enter text"',
                };
                slide.items = [...slide.items, newItem];
              })
            ),
          deleteItem: (slideIndex) =>
            set(
              produce((state) => {
                const itemId = get().selectedItem?.id;
                if (itemId) {
                  const slide = state.slides[slideIndex];
                  slide.items = slide.items.filter(
                    (item: SlideItem) => item.id !== itemId
                  );
                }
              })
            ),
          changeZIndex: (slideIndex, itemId, modifier) =>
            set(
              produce((state) => {
                const slide = state.slides[slideIndex];
                const item = slide.items.find(
                  (item: TextItem | ImageItem) => item.id === itemId
                );
                if (item) {
                  const currentIndex = slide.items.indexOf(item);
                  const targetIndex =
                    modifier === 'top'
                      ? slide.items.length - 1
                      : modifier === 'bottom'
                      ? 0
                      : currentIndex;
                  if (currentIndex !== targetIndex) {
                    slide.items.splice(currentIndex, 1);
                    slide.items.splice(targetIndex, 0, item);
                  }
                }
              })
            ),
          forceRerender: (target) =>
            set({
              [target]: get()[target] === 'true' ? 'false' : 'true',
            }),
          addSlide: (template) =>
            set(
              produce((state) => {
                state.slides = [
                  ...state.slides,
                  {
                    id: Math.random(),
                    items: template ?? [],
                    thumbnailUrl: '',
                  },
                ];
              })
            ),
          deleteSlide: (slideIndex) =>
            set(
              produce((state) => {
                state.slides = state.slides.filter(
                  (slide: Slide, index: number) => index !== slideIndex
                );
              })
            ),
          changeScale: (scale) => set({ slideScale: scale }),
        },
      }),
      {
        name: 'slides-storage',
        version: 1,
        storage: createJSONStorage(() => sessionStorage),
        partialize: ({ actions, ...rest }: any) => rest,
      }
    )
  ),
  shallow
);

export const useSlidesActions = () => useSlidesStore((state) => state.actions);

export default useSlidesStore;
