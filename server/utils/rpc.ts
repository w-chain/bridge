export function getAlchemyRpcUrl(chainId: ChainId) {
  const apiKey = useRuntimeConfig().alchemyApiKey;
  switch (chainId) {
    case ChainId.ETH:
      return `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`;
    case ChainId.SEPOLIA:
      return `https://eth-sepolia.g.alchemy.com/v2/${apiKey}`;
    case ChainId.BSC:
      return `https://bnb-mainnet.g.alchemy.com/v2/${apiKey}`;
    case ChainId.BSC_TESTNET:
      return `https://bnb-testnet.g.alchemy.com/v2/${apiKey}`;
    case ChainId.WCHAIN:
      return 'https://rpc.w-chain.com';
    case ChainId.WCHAIN_TESTNET:
      return 'https://rpc-testnet.w-chain.com';
    default:
      throw new Error(`Unsupported chainId: ${chainId}`);
  }
}