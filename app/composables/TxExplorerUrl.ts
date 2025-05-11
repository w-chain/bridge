import { useVueDapp } from "@vue-dapp/core"

export const useTxExplorerUrl = () => {
  const { chainId } = useVueDapp()
  switch (chainId.value) {
    case 11155111:
      return 'https://sepolia.etherscan.io/tx/'
    case 71117:
      return 'https://scan-testnet.w-chain.com/tx/'
    case 171717:
      return 'https://scan.w-chain.com/tx/'
    case 1:
    default:
      return 'https://etherscan.io/tx/'
  }
}
