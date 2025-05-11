export const useNetworkLogo = (chain_id: number) => {
  switch (chain_id) {
    case 171717:
    case 71117:
      return '/images/networks/w-chain.webp'
    case 97:
    case 56:
      return '/images/networks/bsc.webp'
    case 1:
    case 11155111:
    default:
      return '/images/networks/eth.webp'
  }
}
