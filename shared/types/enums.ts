export enum Networks {
  ETH = 'eth',
  WCHAIN = 'w-chain'
}

export enum Tokens {
  USDT = 'usdt',
  USDC = 'usdc'
}

export const getEnumValues = <T extends { [key: string]: string }>(enumObj: T): string[] => {
  return Object.values(enumObj);
}