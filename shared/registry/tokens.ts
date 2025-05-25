import Token from "../objects/token";
import { ChainId, TokenSymbols } from "../types";

export const TOKENS: Token[] = [
  // Ethereum
  new Token(
    ChainId.ETH, 
    'Tether USD', 
    TokenSymbols.USDT, 
    '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    '0x0000000000000000000000dac17f958d2ee523a2206206994597c13d831ec701',
    6
  ),
  new Token(
    ChainId.ETH,
    'USD Coin',
    TokenSymbols.USDC,
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    '0x0000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4801',
    6
  ),
  // Sepolia
  new Token(
    ChainId.SEPOLIA,
    'Tether USD',
    TokenSymbols.USDT,
    '0x9373D5cec0833Ae2f8b45b22A3159a7B956d7B69',
    '0x00000000000000000000009373d5cec0833ae2f8b45b22a3159a7b956d7b6901',
    6
  ),
  new Token(
    ChainId.SEPOLIA,
    'USD Coin',
    TokenSymbols.USDC,
    '0x5880D73B892745Df7465bcCa1A21cF79Ea2A7Ff5',
    '0x00000000000000000000005880d73b892745df7465bcca1a21cf79ea2a7ff501',
    6
  ),
  // BSC Testnet
  new Token(
    ChainId.BSC_TESTNET,
    'Binance-Peg USDT',
    TokenSymbols.USDT,
    '0x4Ed8aead9f69BE69e20E473485702283569A5423',
    '0x00000000000000000000004ed8aead9f69be69e20e473485702283569a542302',
    18
  ),
  new Token(
    ChainId.BSC_TESTNET,
    'Binance-Peg USDC',
    TokenSymbols.USDC,
    '0x80d7991107149b5dD8396f3Ade48BA07BD60d56A',
    '0x000000000000000000000080d7991107149b5dd8396f3ade48ba07bd60d56a02',
    18
  ),
  // W Chain
  new Token(
    ChainId.WCHAIN,
    'Tether USD',
    TokenSymbols.USDT,
    '0x40CB2CCcF80Ed2192b53FB09720405F6Fe349743',
    '0x0000000000000000000000dac17f958d2ee523a2206206994597c13d831ec701',
    6
  ),
  new Token(
    ChainId.WCHAIN,
    'USD Coin',
    TokenSymbols.USDC,
    '0x643eC74Ed2B79098A37Dc45dcc7F1AbfE2AdE6d8',
    '0x0000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4801',
    6
  ),
  // W Chain Testnet
  new Token(
    ChainId.WCHAIN_TESTNET,
    'Tether USD',
    TokenSymbols.USDT,
    '0x9D6d68774326b2100adD0aA29C928Ed7bdC3B127',
    '0x00000000000000000000009373d5cec0833ae2f8b45b22a3159a7b956d7b6901',
    6
  ),
  new Token(
    ChainId.WCHAIN_TESTNET,
    'USD Coin',
    TokenSymbols.USDC,
    '0x1aB74716E3Ec78c71967a846199407c351094c45',
    '0x00000000000000000000005880d73b892745df7465bcca1a21cf79ea2a7ff501',
    6
  ),
  new Token(
    ChainId.WCHAIN_TESTNET,
    'Binance-Peg USDT',
    TokenSymbols.bUSDT,
    '0x882A45DE01fDA0d854128Fdb4f50dEd2BD84db45',
    '0x00000000000000000000004ed8aead9f69be69e20e473485702283569a542302',
    18
  ),
  new Token(
    ChainId.WCHAIN_TESTNET,
    'Binance-Peg USDC',
    TokenSymbols.bUSDC,
    '0x2eceB789DCa4Fb7860324425A7A8245aaee43cd4',
    '0x000000000000000000000080d7991107149b5dd8396f3ade48ba07bd60d56a02',
    18
  )
]

export function getTokenBySymbol(chainId: ChainId, symbol: TokenSymbols): Token | undefined {
  return TOKENS.find(token => token.chainId === chainId && token.symbol === symbol);
}