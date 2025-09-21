## Onboarding Flow Documentation

The onboarding flow in the Devoter app enables users to securely sign in using their Ethereum wallet. This process ensures that only authenticated users can access features such as favoriting repositories and voting.

### Functional Overview

- **Sign-In Page:**
  - Presents users with a prompt to connect their wallet.
  - Utilizes the `SignInHeader` for instructions and branding.
  - The `SignInForm` component displays the wallet connection interface.

- **Wallet Connection:**
  - The `ConnectWallet` component manages wallet connection and authentication.
  - On clicking "Connect Wallet," users are prompted to connect via RainbowKit.
  - After connecting, a SIWE (Sign-In With Ethereum) message is generated and signed by the user.
  - The signed message is sent to the backend for verification.

- **Session Management:**
  - Upon successful authentication, the user's wallet address is stored in the session.
  - The UI updates to show the connected wallet and a "Sign Out" button.
  - Signing out clears the session and disconnects the wallet.

### Data Flow

1. **Initial State:**
	- User is not authenticated; wallet address is not present in session.
2. **Wallet Connection:**
	- User clicks "Connect Wallet."
	- Wallet modal opens; user connects their wallet.
3. **Authentication:**
	- SIWE message is generated and signed.
	- Backend verifies the signature and establishes a session.
	- UI updates to reflect authenticated state.
4. **Sign Out:**
	- User clicks "Sign Out."
	- Session and wallet connection are cleared.

### Key Components Used

- `SignInHeader`: Displays onboarding instructions.
- `SignInForm`: Contains the wallet connection UI.
- `ConnectWallet`: Handles wallet connection, SIWE authentication, and session management.

### Customization

- The onboarding flow can be extended to support additional authentication providers or custom wallet integrations.
- UI text and branding can be adjusted in `SignInHeader` and `SignInForm`.

### Error Handling

- If wallet connection fails, an error message is displayed.
- If SIWE authentication fails, the user is notified and prompted to retry.
- Signing out errors are handled gracefully with user feedback.

---

For further details, see the implementation in:
- `src/components/pages/signin/components/SignInHeader.tsx`
- `src/components/pages/signin/components/SignInForm.tsx`
- `src/components/common/Wallet/ConnectWallet.tsx`
