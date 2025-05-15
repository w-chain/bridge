import { TOKEN_CONTRACT_REGISTRY } from "../contracts/tokens";

export function getTokenByChainIdAndSymbol(chainId: number, symbol: string) {
  return TOKEN_CONTRACT_REGISTRY[chainId as SupportedChainId].find(token => token.symbol === symbol);
}