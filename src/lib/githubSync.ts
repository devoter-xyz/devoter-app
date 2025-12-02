import { prisma } from "@/lib/prisma";

export async function handleGitHubWebhook(event: string, payload: any) {
  console.log(`Received GitHub event: ${event}`);

  switch (event) {
    case "star":
      await handleStarEvent(payload);
      break;
    case "repository":
      await handleRepositoryEvent(payload);
      break;
    // Add more event handlers as needed
    default:
      console.log(`Unhandled GitHub event type: ${event}`);
      break;
  }
}

async function handleStarEvent(payload: any) {
  const { repository, sender, action } = payload;
  console.log(`Star event: ${action} on ${repository.full_name} by ${sender.login}`);

  if (action === "created" || action === "deleted") {
    await prisma.repository.updateMany({
      where: {
        githubUrl: repository.html_url,
      },
      data: {
        githubStars: repository.stargazers_count,
      },
    });
    console.log(`Updated star count for ${repository.full_name} to ${repository.stargazers_count}`);
  }
}

async function handleRepositoryEvent(payload: any) {
  const { repository, action, changes } = payload;
  console.log(`Repository event: ${action} on ${repository.full_name}`);

  if (action === "renamed" && changes && changes.repository) {
    const oldName = changes.repository.name.from;
    const newName = repository.name;
    console.log(`Repository renamed from ${oldName} to ${newName}`);

    const oldFullName = changes.repository.full_name.from;
    if (!oldFullName || typeof oldFullName !== 'string' || oldFullName.trim() === '') {
      console.error("Error: changes.repository.full_name.from is invalid or empty. Skipping repository update.");
      return;
    }

    await prisma.repository.updateMany({
      where: {
        githubUrl: `https://github.com/${oldFullName}`,
      },
      data: {
        name: newName,
        githubUrl: repository.html_url,
      },
    });
    console.log(`Updated repository name and URL for ${oldName} to ${newName}`);
  } else if (action === "publicized" || action === "privatized") {
    console.log(`Repository ${repository.full_name} is now ${action}`);
    await prisma.repository.updateMany({
      where: {
        githubUrl: repository.html_url,
      },
      data: {

      },
    });
    console.log(`Updated private status for ${repository.full_name} to ${repository.private}`);
  }
}
