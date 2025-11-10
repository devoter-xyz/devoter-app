import { createRepository } from '../logic';
import { DuplicateRepositoryError, WeeklySubmissionLimitError, InvalidGitHubUrlError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import { getRepositorySubmissionCount } from '../../getRepositorySubmissionCount/logic';

// Mock prisma and getRepositorySubmissionCount
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUniqueOrThrow: jest.fn(),
    },
    repository: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    payment: {
      create: jest.fn(),
    },
  },
}));

jest.mock('../../getRepositorySubmissionCount/logic', () => ({
  getRepositorySubmissionCount: jest.fn(),
}));

describe('createRepository', () => {
  const mockUserId = 'test-user-id';
  const mockInput = {
    title: 'Test Repo',
    description: 'A test repository',
    githubUrl: 'https://github.com/test/test-repo',
    tags: ['test', 'repo'],
  };
  const mockUser = {
    id: mockUserId,
    walletAddress: '0x1234567890abcdef',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.user.findUniqueOrThrow as jest.Mock).mockResolvedValue(mockUser);
    (getRepositorySubmissionCount as jest.Mock).mockResolvedValue({ count: 0 });
    (prisma.repository.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.payment.create as jest.Mock).mockResolvedValue({ id: 'payment-id' });
    (prisma.repository.create as jest.Mock).mockResolvedValue({
      id: 'repo-id',
      createdAt: new Date(),
      ...mockInput,
    });
  });

  it('should successfully create a repository', async () => {
    const result = await createRepository(mockInput, mockUserId);

    expect(result).toEqual({
      id: 'repo-id',
      createdAt: expect.any(Date),
      ...mockInput,
    });
    expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: mockUserId },
      select: { id: true, walletAddress: true },
    });
    expect(getRepositorySubmissionCount).toHaveBeenCalledWith(mockUserId);
    expect(prisma.repository.findFirst).toHaveBeenCalledWith({
      where: { githubUrl: mockInput.githubUrl },
    });
    expect(prisma.payment.create).toHaveBeenCalled();
    expect(prisma.repository.create).toHaveBeenCalledWith({
      data: {
        title: mockInput.title,
        description: mockInput.description,
        githubUrl: mockInput.githubUrl,
        submitterId: mockUserId,
        paymentId: 'payment-id',
        tags: mockInput.tags,
      },
      select: {
        id: true,
        title: true,
        description: true,
        githubUrl: true,
        createdAt: true,
      },
    });
  });

  it('should throw WeeklySubmissionLimitError if submission count is 3 or more', async () => {
    (getRepositorySubmissionCount as jest.Mock).mockResolvedValue({ count: 3 });

    await expect(createRepository(mockInput, mockUserId)).rejects.toThrow(WeeklySubmissionLimitError);
  });

  it('should throw InvalidGitHubUrlError for an invalid GitHub URL', async () => {
    const invalidInput = { ...mockInput, githubUrl: 'https://invalid-github.com/test/repo' };
    await expect(createRepository(invalidInput, mockUserId)).rejects.toThrow(InvalidGitHubUrlError);
  });

  it('should throw DuplicateRepositoryError if repository already exists', async () => {
    (prisma.repository.findFirst as jest.Mock).mockResolvedValue({ id: 'existing-repo-id' });

    await expect(createRepository(mockInput, mockUserId)).rejects.toThrow(DuplicateRepositoryError);
  });

  it('should handle tokenAmount if provided', async () => {
    const inputWithToken = { ...mockInput, tokenAmount: 100 };
    await createRepository(inputWithToken, mockUserId);

    expect(prisma.payment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tokenAmount: 100,
        }),
      })
    );
  });

  it('should default tokenAmount to 0 if not provided', async () => {
    await createRepository(mockInput, mockUserId);

    expect(prisma.payment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tokenAmount: 0,
        }),
      })
    );
  });

  it('should throw an error if userId is missing', async () => {
    await expect(createRepository(mockInput, '')).rejects.toThrow('Unauthorized: User ID is missing.');
  });

  it('should throw an error if input is missing', async () => {
    await expect(createRepository(null as any, mockUserId)).rejects.toThrow('Bad Request: Input data is missing.');
  });
});
