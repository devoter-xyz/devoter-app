interface LeaderboardUpdateEmailProps {
  userName: string;
  leaderboardUrl: string;
  topRepos: Array<{ title: string; rank: number; url: string }>;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
      return encodeURI(url);
    }
  } catch (_error) {
    // Invalid URL, return a safe default or empty string
  }
  return ''; // Return empty string for invalid or unsafe URLs
}

export function leaderboardUpdateEmailTemplate({
  userName,
  leaderboardUrl,
  topRepos,
}: LeaderboardUpdateEmailProps): string {
  const escapedUserName = escapeHtml(userName);
  const sanitizedLeaderboardUrl = sanitizeUrl(leaderboardUrl);

  const repoList = topRepos.map(repo => {
    const escapedRepoTitle = escapeHtml(repo.title);
    const sanitizedRepoUrl = sanitizeUrl(repo.url);
    return `<li><a href="${sanitizedRepoUrl}">${escapedRepoTitle}</a> (Rank: ${repo.rank})</li>`;
  }).join('');

  return `
    <h1>Weekly Leaderboard Update!</h1>
    <p>Hi ${escapedUserName},</p>
    <p>Here's your weekly update on the Devoter leaderboard!</p>
    <p>Check out the full leaderboard here: <a href="${sanitizedLeaderboardUrl}">Devoter Leaderboard</a></p>
    <p>Some of the top repositories this week include:</p>
    <ul>
      ${repoList}
    </ul>
    <p>Keep building awesome projects!</p>
  `;
}
