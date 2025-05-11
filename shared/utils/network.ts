export function getNetworkChainId(network: Networks, isTestnet: boolean = false): number {
  switch (network) {
    case Networks.ETH:
      return isTestnet? 11155111 : 1;
    case Networks.WCHAIN:
      return isTestnet? 71117 : 171717;
    default:
      throw new Error(`Unsupported network: ${network}`);
  }
}

export function getNetworkFromChainId(chainId: number): Networks {
  switch (chainId) {
    case 1:
    case 11155111:
      return Networks.ETH;
    case 71117:
    case 171717:
      return Networks.WCHAIN;
    default:
      throw new Error(`Unsupported chainId: ${chainId}`);
  }
}