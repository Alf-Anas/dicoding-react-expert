import React from 'react';
import { render, fireEvent, within } from '@testing-library/react';
import ThreadDetail from './ThreadDetail';
import matchers from '@testing-library/jest-dom/matchers';
import { ThreadDetailResponsesType } from '@/types/thread-detail-responses.interface';
import TestProvider from '@/provider/TestProvider';

// Using require to handle ts error
const { expect, describe, it } = require('@jest/globals');
// IMPORTANT to extend expect with jest-dom matchers
expect.extend(matchers);

/**
 * test scenario for ThreadDetail Component
 *
 * - ThreadDetail Component
 *  - renders thread details
 *  - handles voting
 *
 */

const mockThread: ThreadDetailResponsesType = {
  id: 'thread-01',
  title: 'Thread Title',
  body: 'Thread Body...',
  createdAt: '2023-01-29T07:30:45Z',
  owner: {
    id: 'user-001',
    name: 'user 001',
    avatar: 'https://ui-avatars.com/api/?name=User 001&background=random',
  },
  category: 'my-category',
  comments: [],
  upVotesBy: [],
  downVotesBy: ['user-002'],
};

const mockProfile = {
  id: 'user-001',
  name: 'user 001',
  avatar: 'https://ui-avatars.com/api/?name=User 001&background=random',
  email: 'user01@mail.com',
};

describe('ThreadDetail Component', () => {
  it('renders thread details', () => {
    const { getByText } = render(
      <TestProvider>
        <ThreadDetail thread={mockThread} profile={mockProfile} />
      </TestProvider>,
    );

    // Assert thread details are rendered
    expect(getByText(mockThread.title)).toBeInTheDocument();
    expect(getByText(mockThread.body)).toBeInTheDocument();
    expect(getByText(mockThread.owner.name)).toBeInTheDocument();
    expect(getByText(`#${mockThread.category}`)).toBeInTheDocument();
  });

  it('handles voting', () => {
    const { getByRole } = render(
      <TestProvider>
        <ThreadDetail thread={mockThread} profile={mockProfile} />
      </TestProvider>,
    );

    // Simulate voting up
    const voteUpButton = getByRole('button', { name: /^like$/i });
    fireEvent.click(voteUpButton);

    // Assert vote up is handled
    expect(within(voteUpButton).getByText('1')).toBeInTheDocument(); // Assuming there's one up vote after clicking

    // Simulate voting down
    const voteDownButton = getByRole('button', { name: /dislike/i });
    fireEvent.click(voteDownButton);

    // Assert vote down is handled
    expect(within(voteDownButton).getByText('2')).toBeInTheDocument(); // Assuming there's two down vote after clicking
  });
});
