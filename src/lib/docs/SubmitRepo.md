# Submit Repository

The **Submit Repository** feature allows users to submit their GitHub repositories for community voting on the Devoter platform. This process is designed to be simple, fair, and secure, ensuring that each user can participate in the weekly repository showcase.

## How It Works

1. **Access the Submission Page**
   - Navigate to the **Submit Repository** page from the main navigation or dashboard.

2. **Fill Out the Submission Form**
   - **Repository Title**: Enter a descriptive title for your project.
   - **Description**: Provide a summary of your repository, highlighting its features and why it deserves votes.
   - **GitHub Repository URL**: Paste the full URL to your public GitHub repository.

3. **Submission Limit**
   - Each user can submit **one repository per week**. The form displays your current submission count and disables further submissions if the limit is reached.

4. **Payment Requirement**
   - A small payment (e.g., 0.01 ETH) is required to submit a repository. This helps prevent spam and supports the platform.
   - After filling out the form, complete the payment using the integrated payment component.

5. **Successful Submission**
   - Upon successful payment and form validation, your repository is submitted for community voting.
   - You will receive a confirmation message, and your submission count will update.

## Error Handling
- If there is an error during payment or submission, an error message will be displayed. You can retry the process after resolving the issue.

## UI Components Used
- **FormInput**: For text fields (title, GitHub URL)
- **FormTextArea**: For the description
- **Payment**: Handles payment and triggers submission on success
- **FormSubmit**: Handles the submit button state
- **Tooltip**: Provides information about submission limits

## Notes
- Only public GitHub repositories are accepted.
- The submission limit resets every week.
- Make sure your repository complies with the platform's guidelines.

---

For more details, see the source code in `src/app/submit-repo/page.tsx` and related components in `src/components/pages/submit-repo/`.
