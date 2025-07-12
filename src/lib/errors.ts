export class InsufficientTokenBalanceError extends Error {
  constructor(message: string = 'You do not have enough DEV tokens to vote.') {
    super(message);
    this.name = 'InsufficientTokenBalanceError';
  }
}
