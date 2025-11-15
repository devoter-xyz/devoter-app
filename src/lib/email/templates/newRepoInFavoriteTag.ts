interface NewRepoInFavoriteTagEmailProps {
  userName: string;
  tagName: string;
  repositoryTitle: string;
  repositoryUrl: string;
  repositoryDescription: string;
}

export function newRepoInFavoriteTagEmailTemplate({
  userName,
  tagName,
  repositoryTitle,
  repositoryUrl,
  repositoryDescription,
}: NewRepoInFavoriteTagEmailProps): string {
  return `
    <h1>New Repository in Your Favorite Tag: ${tagName}!</h1>
    <p>Hi ${userName},</p>
    <p>A new repository matching your favorite tag <strong>${tagName}</strong> has been added to Devoter!</p>
    <h2>${repositoryTitle}</h2>
    <p>${repositoryDescription}</p>
    <p>Check it out here: <a href="${repositoryUrl}">${repositoryTitle}</a></p>
    <p>Happy discovering!</p>
  `;
}
