
export const createWagmiConfig = (projectId: string) => {
  const connectors = createWalletConnectors(projectId);
  const config = createConfig({
    connectors,
    chains: wagmiChains,
    transports,
    ssr: true,
    storage: createStorage({ storage: cookieStorage })
  });
  return config;
}
