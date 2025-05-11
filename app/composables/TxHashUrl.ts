export const useTxHashUrl = (chainId: number, txHash: string) => {
  switch (chainId) {
    case 11155111:
      return 'https://sepolia.etherscan.io/tx/' + txHash
    case 71117:
      return 'https://scan-testnet.w-chain.com/tx/' + txHash
    case 171717:
      return 'https://scan.w-chain.com/tx/' + txHash
    case 1:
    default:
      return 'https://etherscan.io/tx/' + txHash
  }
}
