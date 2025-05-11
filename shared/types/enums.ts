export enum Networks {
  ETH = 'ETH',
  WCHAIN = 'W-CHAIN'
}

export enum Tokens {
  USDT = 'USDT',
  USDC = 'USDC'
}

export enum TransactionStatus {
  NO_STATUS = 'No Status',
  INIT = 'Transaction Initialized',
  PENDING = 'Transaction Pending',
  SUBMITTED = 'Transaction Submitted',
  AWAITING = 'Transaction Awaiting Validators Votes',
  SUCCESS = 'Transaction Successful',
  FAILED = 'Transaction Failed',
  REJECTED = 'Transaction Rejected'
}

export const getEnumValues = <T extends { [key: string]: string }>(enumObj: T): string[] => {
  return Object.values(enumObj);
}