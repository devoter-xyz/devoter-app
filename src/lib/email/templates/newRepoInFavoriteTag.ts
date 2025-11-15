interface NewRepoInFavoriteTagEmailProps {
  userName: string;
  tagName: string;
  repositoryTitle: string;
  repositoryUrl: string;
  repositoryDescription: string;
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

export function newRepoInFavoriteTagEmailTemplate({
  userName,
  tagName,
  repositoryTitle,
  repositoryUrl,
  repositoryDescription,
}: NewRepoInFavoriteTagEmailProps): string {
  const escapedUserName = escapeHtml(userName);
  const escapedTagName = escapeHtml(tagName);
  const escapedRepositoryTitle = escapeHtml(repositoryTitle);
  const sanitizedRepositoryUrl = sanitizeUrl(repositoryUrl);
  const escapedRepositoryDescription = escapeHtml(repositoryDescription);

  return `
    <h1>New Repository in Your Favorite Tag: ${escapedTagName}!</h1>
    <p>Hi ${escapedUserName},</p>
    <p>A new repository matching your favorite tag <strong>${escapedTagName}</strong> has been added to Devoter!</p>
    <h2>${escapedRepositoryTitle}</h2>
    <p>${escapedRepositoryDescription}</p>
    <p>Check it out here: <a href="${sanitizedRepositoryUrl}">${escapedRepositoryTitle}</a></p>
    <p>Happy discovering!</p>
  `;
}
