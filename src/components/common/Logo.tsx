'use client';

import Link from 'next/link';
import { LogoText } from './LogoText';

interface LogoProps {}

export function Logo(props: LogoProps) {
  return (
    <Link href="/" className="flex items-center">
      <LogoText />
    </Link>
  );
}

