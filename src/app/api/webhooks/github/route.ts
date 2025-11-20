
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { env } from "@/lib/env";
import { handleGitHubWebhook } from "@/lib/githubSync";

export async function POST(req: Request) {
  const signature = headers().get("x-hub-signature-256");
  const event = headers().get("x-github-event");
  const payload = await req.text();

  if (!signature || !event) {
    return new NextResponse("Missing signature or event header", { status: 400 });
  }

  const hmac = crypto.createHmac("sha256", env.GITHUB_WEBHOOK_SECRET);
  hmac.update(payload);
  const digest = "sha256=" + hmac.digest("hex");

  if (signature !== digest) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  try {
    const parsedPayload = JSON.parse(payload);
    await handleGitHubWebhook(event, parsedPayload);
    return new NextResponse("Webhook received", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new NextResponse("Error processing webhook", { status: 500 });
  }
}
