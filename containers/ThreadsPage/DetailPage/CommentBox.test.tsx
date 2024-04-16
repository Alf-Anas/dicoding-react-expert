import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CommentBox from './CommentBox';
import matchers from '@testing-library/jest-dom/matchers';
import TestProvider from '@/provider/TestProvider';
import useAuth from '@/hooks/useAuth';

// Using require to handle ts error
const { expect, describe, it } = require('@jest/globals');
// IMPORTANT to extend expect with jest-dom matchers
expect.extend(matchers);

/**
 * test scenario for CommentBox Component
 *
 * - CommentBox Component
 *  - shows login link if user is unauthenticated
 *  - renders comment box and input value
 *
 */

jest.mock('@/hooks/useAuth', () => ({
  __esModule: true,
  default: jest.fn(() => ({ isAuthenticated: 'unauthenticated' })),
}));

describe('CommentBox Component', () => {
  it('shows login link if user is unauthenticated', () => {
    jest.mock('@/hooks/useAuth', () => ({
      __esModule: true,
      default: () => ({ isAuthenticated: 'unauthenticated' }),
    }));
    (useAuth as jest.Mock).mockReturnValueOnce({
      isAuthenticated: 'unauthenticated',
    });

    const { getByText } = render(
      <TestProvider>
        <CommentBox threadId='thread-002' />
      </TestProvider>,
    );

    expect(getByText(/Login/i)).toBeInTheDocument();
  });

  it('renders comment box and input value', async () => {
    (useAuth as jest.Mock).mockReturnValueOnce({
      isAuthenticated: 'authenticated',
    });
    const { getByRole } = render(
      <TestProvider>
        <CommentBox threadId='thread-001' />
      </TestProvider>,
    );
    const commentTextArea = getByRole('textbox');
    const commentButton = getByRole('button', { name: 'Comment' });
    const commentContent = 'This is a test comment';

    fireEvent.change(commentTextArea, { target: { value: commentContent } });
    fireEvent.click(commentButton);

    expect(commentTextArea).toHaveValue(commentContent);
  });
});
