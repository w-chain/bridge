export const getDomainId = (chainId: SupportedChainId) => {
  switch (chainId) {
    case 171717:
    case 71117:
      return 0;
    case 1:
    case 11155111:
      return 1;
    default:
      throw new Error('getDomainId: Invalid network');
  }
}