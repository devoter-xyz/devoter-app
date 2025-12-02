export interface Repo {
  id: string;
  name: string;
  description: string;
  url?: string; // Optional, based on mockRepo
  owner: string;
  ownerAvatar?: string; // Optional, based on mockRepo
  stars?: number; // Optional, based on mockRepo
  tags: string[];
  href?: string; // Optional, based on mockRepo
    featured?: boolean; // Optional, based on mockRepo
  submissionCount?: number; // Optional, based on mockRepo
  createdAt?: string; // Optional, based on mockRepo
  updatedAt?: string; // Optional, based on mockRepo
  lastSubmission?: string; // Optional, based on mockRepo
  totalVotes?: number; // Optional, based on mockRepo
  rank?: number; // Optional, based on mockRepo
  votes: number;
  logoUrl: string;
  isVerified: boolean;
  variant: 'default' | 'featured' | 'first' | 'second' | 'third';
}
