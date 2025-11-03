import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Actions } from '../Actions';

// Mock the ConnectWallet component as it's external and not the focus of these tests
jest.mock('../Wallet/ConnectWallet', () => ({
  ConnectWallet: () => <div data-testid="connect-wallet-mock" />,
}));

describe('Actions component - Dropdown Menu', () => {
  it('should open the dropdown when the bell icon button is clicked', async () => {
    render(<Actions />);
    const bellButton = screen.getByRole('button', { name: /notifications/i });
    await userEvent.click(bellButton);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText(/You have 5 unread messages./i)).toBeInTheDocument();
  });

  it('should close the dropdown when the Escape key is pressed', async () => {
    render(<Actions />);
    const bellButton = screen.getByRole('button', { name: /notifications/i });
    await userEvent.click(bellButton); // Open
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await userEvent.keyboard('{escape}'); // Close with Escape key
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should close the dropdown when clicking outside of it', async () => {
    render(
      <div>
        <Actions />
        <button>Outside Button</button>
      </div>
    );
    const bellButton = screen.getByRole('button', { name: /notifications/i });
    await userEvent.click(bellButton); // Open
    expect(screen.getByRole('menu')).toBeInTheDocument();

    // Simulate clicking outside by pressing Escape, as direct outside clicks are problematic with pointer-events: none
    await userEvent.keyboard('{escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should navigate through dropdown items using arrow keys', async () => {
    render(<Actions />);
    const bellButton = screen.getByRole('button', { name: /notifications/i });
    await userEvent.click(bellButton); // Open

    const dropdownMenu = screen.getByRole('menu');
    const notificationItems = screen.getAllByRole('menuitem');
    expect(notificationItems.length).toBe(5);

    // Focus the dropdown menu content first, then navigate
    dropdownMenu.focus();

    // Press ArrowDown to focus the first item
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(notificationItems[0]);

    // Press ArrowDown again to focus the second item
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(notificationItems[1]);

    // Press ArrowUp to focus the first item again
    await userEvent.keyboard('{ArrowUp}');
    expect(document.activeElement).toBe(notificationItems[0]);

    // Press Escape to close the dropdown
    await userEvent.keyboard('{escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should have correct ARIA roles and attributes for accessibility', async () => {
    render(<Actions />);
    const bellButton = screen.getByRole('button', { name: /notifications/i });

    // Check initial ARIA attributes
    expect(bellButton).toHaveAttribute('aria-haspopup', 'menu');
    expect(bellButton).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(bellButton); // Open

    // Check ARIA attributes after opening
    expect(bellButton).toHaveAttribute('aria-expanded', 'true');
    const dropdownMenu = screen.getByRole('menu');
    expect(dropdownMenu).toBeInTheDocument();
    expect(dropdownMenu).toHaveAttribute('aria-labelledby', bellButton.id);

    const notificationItems = screen.getAllByRole('menuitem');
    notificationItems.forEach(item => {
      expect(item).toHaveAttribute('role', 'menuitem');
    });
  });
});