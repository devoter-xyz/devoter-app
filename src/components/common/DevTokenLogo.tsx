import Image from 'next/image';
import React from 'react';

interface DevTokenLogoProps {
  size?: number;
}

export const DevTokenLogo: React.FC<DevTokenLogoProps> = ({ size = 16 }) => {
  return (
    <Image
      src="/dev-token-logo.png"
      alt="Dev Token Logo"
      width={size}
      height={size}
      className="rounded-full"
    />
  );
}; 