interface LeaderboardUpdateEmailProps {
  userName: string;
  leaderboardUrl: string;
  topRepos: Array<{ title: string; rank: number; url: string }>;
}

export function leaderboardUpdateEmailTemplate({
  userName,
  leaderboardUrl,
  topRepos,
}: LeaderboardUpdateEmailProps): string {
  const repoList = topRepos.map(repo => `<li><a href="${repo.url}">${repo.title}</a> (Rank: ${repo.rank})</li>`).join('');

  return `
    <h1>Weekly Leaderboard Update!</h1>
    <p>Hi ${userName},</p>
    <p>Here's your weekly update on the Devoter leaderboard!</p>
    <p>Check out the full leaderboard here: <a href="${leaderboardUrl}">Devoter Leaderboard</a></p>
    <p>Some of the top repositories this week include:</p>
    <ul>
      ${repoList}
    </ul>
    <p>Keep building awesome projects!</p>
  `;
}
