import { cn } from '@/lib/utils';

// VerifiedIcon: size-only; color handled by surrounding context or theme
const VerifiedIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={cn('h-6 w-6 text-brand-orange', className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"
        fill="currentColor"
      />
    </svg>
  );
};

export default VerifiedIcon;
