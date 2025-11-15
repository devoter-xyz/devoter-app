interface NewVoteEmailProps {
  userName: string;
  repositoryTitle: string;
  voterName: string;
  voteAmount: string;
  repositoryUrl: string;
}

export function newVoteEmailTemplate({
  userName,
  repositoryTitle,
  voterName,
  voteAmount,
  repositoryUrl,
}: NewVoteEmailProps): string {
  return `
    <h1>New Vote on Your Repository!</h1>
    <p>Hi ${userName},</p>
    <p>Good news! Your repository <strong>${repositoryTitle}</strong> has received a new vote.</p>
    <p><strong>${voterName}</strong> just voted with <strong>${voteAmount}</strong>.</p>
    <p>Check out your repository here: <a href="${repositoryUrl}">${repositoryTitle}</a></p>
    <p>Thanks for being a part of Devoter!</p>
  `;
}
