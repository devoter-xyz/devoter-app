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

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized.') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class BadRequestError extends Error {
  constructor(message = 'Bad Request.') {
    super(message);
    this.name = 'BadRequestError';
  }
}

export class NetworkError extends Error {
  cause?: Error;
  constructor(message = 'A network error occurred. Please check your internet connection and try again.', cause?: Error) {
    super(message);
    this.name = 'NetworkError';
    this.cause = cause;
  }
}

export class ValidationError extends Error {
  constructor(message = 'Validation failed. Please check your input.') {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Not Found.') {
    super(message);
    this.name = 'NotFoundError';
  }
}
