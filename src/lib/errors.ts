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

export class DuplicateRepositoryError extends Error {
  constructor(message = 'This repository has already been submitted.') {
    super(message);
    this.name = 'DuplicateRepositoryError';
  }
}

export class WeeklySubmissionLimitError extends Error {
  constructor(message = 'You have reached your weekly submission limit.') {
    super(message);
    this.name = 'WeeklySubmissionLimitError';
  }
}

export class InvalidGitHubUrlError extends Error {
  constructor(message = 'Invalid GitHub repository URL.') {
    super(message);
    this.name = 'InvalidGitHubUrlError';
  }
}
