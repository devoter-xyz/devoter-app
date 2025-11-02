'use client';

import Image from 'next/image';

interface LogoTextProps {}

export function LogoText(props: LogoTextProps) {
  return <Image src="/logo_text.svg" alt="Devoter Logo" width={120} height={40} />;
}
