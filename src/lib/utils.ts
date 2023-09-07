import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl() {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return '';

  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;

  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;

  // MAKE SURE TO SET THE NEXT_PUBLIC_AWS_AMPLIFY_APP_URL ENVIRONMENT VARIABLE in AMPLIFY
  if (process.env.NEXT_PUBLIC_AWS_AMPLIFY_APP_URL)
    // reference for AWS Amplify deployment
    return process.env.NEXT_PUBLIC_AWS_AMPLIFY_APP_URL;

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const formatTimestamp = (timestamp: string) => {
  const now = new Date();
  const date = new Date(timestamp);

  // If the timestamp is within the last minute, display "now"
  if (now.getTime() - date.getTime() < 60000) {
    return 'now';
  }

  // If the timestamp is from today, display the time
  if (
    date.getDate() == now.getDate() &&
    date.getMonth() == now.getMonth() &&
    date.getFullYear() == now.getFullYear()
  ) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `Today ${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  }

  // If the timestamp is from yesterday, display "yesterday"
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  );
  if (
    date.getDate() == yesterday.getDate() &&
    date.getMonth() == yesterday.getMonth() &&
    date.getFullYear() == yesterday.getFullYear()
  ) {
    return 'Yesterday';
  }

  // Otherwise, display the date in the format "MMM DD, YYYY"
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const monthIndex = date.getMonth();
  const monthName = monthNames[monthIndex];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${monthName} ${day}, ${year}`;
};

export function generateRandomString(length: number): string {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return result;
}

export const pxToNum = (value: number | string = 0): number =>
  typeof value === 'number' ? value : Number.parseFloat(value);

export const viewHeight = (): number => window.innerHeight;

export const viewWidth = (): number => window.innerWidth;

export function isRelativeOrAbsoluteUrl(url: string) {
  return /^\/|https?:\/\//.test(url);
}

export function getLocalTimeString(input: string) {
  const date = new Date(input);
  const localTimeString = date.toLocaleTimeString('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
  });
  return localTimeString;
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
