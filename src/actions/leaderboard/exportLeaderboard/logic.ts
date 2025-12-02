import { getLeaderboard } from '@/actions/leaderboard/getLeaderboard/logic';
import { MAX_EXPORT_FILE_SIZE_BYTES } from '@/lib/constants';

export async function exportLeaderboardLogic(format: 'csv' | 'json', week: string): Promise<string> {
  const { leaderboard } = await getLeaderboard({ week });

  if (!leaderboard || leaderboard.length === 0) {
    throw new Error('Leaderboard data not found.');
  }

  let fileContent: string;
  if (format === 'csv') {
    fileContent = convertToCsv(leaderboard);
  } else if (format === 'json') {
    fileContent = JSON.stringify(leaderboard, null, 2);
  } else {
    throw new Error('Unsupported format.');
  }

  // Basic file size limit check (e.g., 10MB)
  if (Buffer.byteLength(fileContent, 'utf8') > MAX_EXPORT_FILE_SIZE_BYTES) {
    throw new Error('Export file size exceeds limit.');
  }

  return Buffer.from(fileContent).toString('base64');
}

function convertToCsv(entries: any[]): string {
  if (entries.length === 0) {
    return '';
  }

  const headers = ['rank', 'repositoryName', 'owner', 'voteCount', 'votingPower'];
  const csvRows = [headers.join(',')];

  for (const entry of entries) {
        const row = [
          entry.rank,
          `"${entry.repository.name.replace(/"/g, '""')}"`,
          `"${entry.repository.owner.replace(/"/g, '""')}"`,
          entry.voteCount,
          entry.votingPower,
        ];
    csvRows.push(row.join(','));
  }

  return csvRows.join('\n');
}