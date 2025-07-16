export class InsufficientTokenBalanceError extends Error {
  constructor(message = 'Insufficient DEV token balance.') {
    super(message);
    this.name = 'InsufficientTokenBalanceError';
  }
}

export class InvalidTransactionError extends Error {
  constructor(message = 'Invalid transaction.') {
    super(message);
    this.name = 'InvalidTransactionError';
  }
}
