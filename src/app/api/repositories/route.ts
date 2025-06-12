import { NextResponse } from 'next/server';
import { z } from 'zod';
import { repositorySchema } from '@/lib/validations/repository';
import { prisma } from '@/lib/db'; // Assuming you have a prisma client instance exported from here

// Placeholder for getting current user - replace with your actual auth logic
async function getCurrentUser() {
  // Example: return { id: 'user_id_from_session_or_token', walletAddress: 'user_wallet_address' };
  // For now, let's assume a mock user for development
  // In a real app, you'd get this from session, JWT, etc.
  console.warn("TODO: Implement actual user authentication in getCurrentUser()");
  return {
    id: "clerk_user_id_placeholder", // Replace with actual user ID logic
    walletAddress: "0x1234567890123456789012345678901234567890" // Replace with actual user wallet
  };
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const body = repositorySchema.parse(json);

    // --- TODO: Implement Submission Limit (3 repos per week per account) ---
    // 1. Calculate the start of the current week.
    // 2. Count repositories submitted by user.id this week.
    // 3. If count >= 3, return an error.
    console.warn("TODO: Implement repository submission limit check.");
    const MAX_REPOS_PER_WEEK = 3;
    const startOfWeek = new Date(); // Placeholder - needs actual week start calculation
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const userRepoCountThisWeek = await prisma.repository.count({
      where: {
        submitterId: user.id,
        createdAt: {
          gte: startOfWeek,
        },
      },
    });

    if (userRepoCountThisWeek >= MAX_REPOS_PER_WEEK) {
      return NextResponse.json(
        { error: 'You have reached your weekly submission limit of 3 repositories.' },
        { status: 429 }
      );
    }
    // --- End of Submission Limit Check ---

    // --- TODO: Implement USDC Approval & Payment Transaction Handling ---
    // 1. Check for USDC allowance from user's wallet to your contract/wallet.
    // 2. If insufficient, guide user to approve.
    // 3. Initiate/verify the 1 USDC payment transaction.
    // 4. Get the transaction hash.
    console.warn("TODO: Implement USDC approval and payment transaction handling.");
    const MOCK_PAYMENT_TX_HASH = `0xmocktxhash${Date.now()}`;
    const MOCK_PAYMENT_AMOUNT = 1; // 1 USDC
    // --- End of Payment Handling ---

    // Create a payment record first
    // In a real scenario, this might happen after successful transaction confirmation
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        walletAddress: user.walletAddress, // Ensure this is the correct wallet for payment
        tokenAmount: MOCK_PAYMENT_AMOUNT,
        txHash: MOCK_PAYMENT_TX_HASH, // From actual transaction
        week: getWeekIdentifier(new Date()), // Helper function to get 'YYYY-WW' format
        // voteId will be null for repository submission payments
      },
    });

    // Create the repository
    const repository = await prisma.repository.create({
      data: {
        title: body.title,
        description: body.description,
        githubUrl: body.githubUrl,
        submitterId: user.id,
        paymentId: payment.id, // Link to the payment record
        // totalVotes and totalTokenAmount will be updated by votes
      },
    });

    return NextResponse.json({ repository, payment }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating repository:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Helper function to get week identifier (e.g., "2023-42")
function getWeekIdentifier(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil((((d.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7);
  // Return array of year and week number
  return `${d.getUTCFullYear()}-${weekNo.toString().padStart(2, '0')}`;
} 