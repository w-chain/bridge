export const useTxHashUrl = (chainId: number, txHash: string) => {
  const url = getExplorerTxUrl(chainId);
  return `${url}${txHash}`
}
