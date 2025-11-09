'use client';

import { createWagmiConfig } from '@/lib/wallet-utils';

export function getConfig(options?: { projectId?: string }) {
  const projectId = options?.projectId || '';
  const config = createWagmiConfig(projectId);
  return config;
}
