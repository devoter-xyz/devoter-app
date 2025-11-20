
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { env } from "@/lib/env";
import { handleGitHubWebhook } from "@/lib/githubSync";

export async function POST(req: Request) {
  const headersList = await headers();
  const signature = headersList.get("x-hub-signature-256");
  const event = headersList.get("x-github-event");
  const payload = await req.text();

  if (!signature || !event) {
    return new NextResponse("Missing signature or event header", { status: 400 });
  }

  const hmac = crypto.createHmac("sha256", env.GITHUB_WEBHOOK_SECRET);
  hmac.update(payload);
  const digest = "sha256=" + hmac.digest("hex");

  const signatureBuffer = Buffer.from(signature);
  const digestBuffer = Buffer.from(digest);

  if (signatureBuffer.length !== digestBuffer.length || !crypto.timingSafeEqual(signatureBuffer, digestBuffer)) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  let parsedPayload: any;
  try {
    parsedPayload = JSON.parse(payload);
  } catch (error) {
    console.error("Error parsing webhook payload:", error);
    return new NextResponse("Invalid JSON payload", { status: 400 });
  }

  // Validate payload shape
  if (!parsedPayload || typeof parsedPayload !== 'object' || !parsedPayload.repository) {
    console.error("Invalid webhook payload shape: missing required 'repository' field.");
    return new NextResponse("Invalid payload shape: missing required 'repository' field", { status: 400 });
  }

  try {
    await handleGitHubWebhook(event, parsedPayload);
    return new NextResponse("Webhook received", { status: 200 });
  } catch (error: any) {
    console.error(`Error processing webhook: ${error.name} - ${error.message}`);
    // For internal monitoring, full error can be logged securely elsewhere.
    return new NextResponse("Error processing webhook", { status: 500 });
  }
}
