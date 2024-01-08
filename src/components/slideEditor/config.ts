import type { HandleStyles } from 'react-rnd';

export const AUTOSAVE_INTERVAL_MS = 60000; // 1 minute

export const MIN_RESIZE_HEIGHT = 30;
export const MIN_RESIZE_WIDTH = 120;

export const RESIZE_GRID_SNAP: [number, number] = [10, 10];
export const DRAG_GRID_SNAP: [number, number] = [12, 12];

// scale ratio multiple from 1600 x 900
export const SLIDE_SCALE_RATIO = '0.6';
export const SLIDE_SCALE_RATIO_STEP = 0.001;
export const SLIDE_SCALE_RATIO_MAX = 1;
export const SLIDE_SCALE_RATIO_MIN = 0.1;

export const SLIDE_THUMBNAIL_SCALE = 0.2;
export const MAX_NO_OF_SLIDES = 7;

export const DEFAULT_DIMENSIONS = {
  width: 200,
  height: 200,
  x: 0,
  y: 0,
};

export const rndConfig = {
  cancel: '.cancel', // Cancel dragging if target matches selector
  // dragHandleClassName: 'handle', // Specify selector for drag handle
  // bounds: 'parent',
  className: 'resize-content group/resize',
  resizeHandleWrapperClass: 'resize-handle-wrapper opacity-0 group/resize',
  enableUserSelectHack: true,
  minHeight: `${MIN_RESIZE_HEIGHT}px`,
  minWidth: `${MIN_RESIZE_WIDTH}px`,
  resizeHandleStyles: {
    bottom: {
      cursor: 'ns-resize',
      borderTop: '2px solid #3484F0',
      bottom: '-8px',
    },
    top: {
      cursor: 'ns-resize',
      borderBottom: '2px solid #3484F0',
      top: '-8px',
    },
    left: {
      cursor: 'ew-resize',
      borderRight: '2px solid #3484F0',
      left: '-8px',
    },
    right: {
      cursor: 'ew-resize',
      borderLeft: '2px solid #3484F0',
      right: '-8px',
    },
    bottomLeft: {
      backgroundColor: 'white',
      borderRadius: '50%',
      border: '2px solid #3484F0',
      width: '12px',
      height: '12px',
      left: '-4px',
      bottom: '-4px',
    },
    bottomRight: {
      backgroundColor: 'white',
      borderRadius: '50%',
      border: '2px solid #3484F0',
      width: '12px',
      height: '12px',
      right: '-4px',
      bottom: '-4px',
    },
    topLeft: {
      backgroundColor: 'white',
      borderRadius: '50%',
      border: '2px solid #3484F0',
      width: '12px',
      height: '12px',
      left: '-4px',
      top: '-4px',
    },
    topRight: {
      backgroundColor: 'white',
      borderRadius: '50%',
      border: '2px solid #3484F0',
      width: '12px',
      height: '12px',
      right: '-4px',
      top: '-4px',
    },
  } as HandleStyles,
};

export const RESIZING_DISABLED = {
  bottom: false,
  bottomLeft: false,
  bottomRight: false,
  left: false,
  right: false,
  top: false,
  topLeft: false,
  topRight: false,
};

export const RESIZING_ENABLED = {
  bottom: true,
  bottomLeft: true,
  bottomRight: true,
  left: true,
  right: true,
  top: true,
  topLeft: true,
  topRight: true,
};

export const IMAGE_SETS = [
  'https://img.freepik.com/premium-photo/colorful-oil-paint-strokes-generative-ai-illustrator_438099-25037.jpg',
  'https://pngimg.com/uploads/tree/tree_PNG92741.png',
  'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
];
