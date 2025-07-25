'use client';

import Link from 'next/link';
import { LogoText } from './LogoText';

export function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <LogoText />
    </Link>
  );
}

