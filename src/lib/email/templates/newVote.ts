interface NewVoteEmailProps {
  userName: string;
  repositoryTitle: string;
  voterName: string;
  voteAmount: string;
  repositoryUrl: string;
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

export function newVoteEmailTemplate({
  userName,
  repositoryTitle,
  voterName,
  voteAmount,
  repositoryUrl,
}: NewVoteEmailProps): string {
  const escapedUserName = escapeHtml(userName);
  const escapedRepositoryTitle = escapeHtml(repositoryTitle);
  const escapedVoterName = escapeHtml(voterName);
  const escapedVoteAmount = escapeHtml(voteAmount);
  const sanitizedRepositoryUrl = sanitizeUrl(repositoryUrl);

  return `
    <h1>New Vote on Your Repository!</h1>
    <p>Hi ${escapedUserName},</p>
    <p>Good news! Your repository <strong>${escapedRepositoryTitle}</strong> has received a new vote.</p>
    <p><strong>${escapedVoterName}</strong> just voted with <strong>${escapedVoteAmount}</strong>.</p>
    <p>Check out your repository here: <a href="${sanitizedRepositoryUrl}">${escapedRepositoryTitle}</a></p>
    <p>Thanks for being a part of Devoter!</p>
  `;
}
