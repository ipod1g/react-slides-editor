import { cn } from '@/lib/utils';
import { IoClose } from 'react-icons/io5';

interface CloseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'red';
}

const CloseButton = ({ variant, className, ...rest }: CloseButtonProps) => {
  return (
    <button
      className={cn(
        'disabled:opacity-60 w-6 opacity-90 transition-opacity hover:opacity-100',
        {
          'bg-primary-red rounded-md p-1 text-white': variant === 'red',
        },
        className
      )}
      {...rest}
    >
      <IoClose size={'100%'} />
    </button>
  );
};

export default CloseButton;
