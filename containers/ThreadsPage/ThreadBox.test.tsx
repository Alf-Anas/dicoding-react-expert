import React from 'react';
import { render, fireEvent, within } from '@testing-library/react';
import ThreadBox from './ThreadBox';
import { ThreadsWithUserType } from '@/types/threads-responses.interface';
import matchers from '@testing-library/jest-dom/matchers';
import TestProvider from '@/provider/TestProvider';
import mockRouter from 'next-router-mock';
import { ROUTE } from '@/constants';

// Using require to handle ts error
const { expect, describe, it } = require('@jest/globals');
// IMPORTANT to extend expect with jest-dom matchers
expect.extend(matchers);

jest.mock('next/navigation', () => jest.requireActual('next-router-mock'));

/**
 * test scenario for ThreadBox Component
 *
 * - ThreadBox Component
 *  - renders thread box with correct information
 *  - handles voting
 *  - navigates to thread detail when clicked
 *
 */

const mockProfile = {
  id: 'user-001',
  name: 'user 001',
  avatar: 'https://ui-avatars.com/api/?name=User 001&background=random',
  email: 'user01@mail.com',
};

const mockThread: ThreadsWithUserType = {
  id: 'thread-01',
  title: 'Thread Title',
  body: 'Thread Body...',
  createdAt: '2023-01-29T07:30:45Z',
  user: mockProfile,
  category: 'my-category',
  upVotesBy: [],
  downVotesBy: ['user-002'],
  totalComments: 0,
  ownerId: 'user-001',
};

describe('ThreadBox Component', () => {
  it('renders thread box with correct information', () => {
    const { getByText, getByRole } = render(
      <TestProvider>
        <ThreadBox thread={mockThread} profile={mockProfile} />
      </TestProvider>,
    );

    expect(getByText(mockProfile.name)).toBeInTheDocument();
    expect(getByText(mockThread.title)).toBeInTheDocument();
    expect(getByText(mockThread.body)).toBeInTheDocument();
    expect(getByText(`#${mockThread.category}`)).toBeInTheDocument();
    expect(getByRole('button', { name: /comment/i })).toBeInTheDocument();
  });

  it('handles voting', () => {
    const { getByRole } = render(
      <TestProvider>
        <ThreadBox thread={mockThread} profile={mockProfile} />
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

  it('navigates to thread detail when clicked', () => {
    const { getByRole } = render(
      <TestProvider>
        <ThreadBox thread={mockThread} profile={mockProfile} />
      </TestProvider>,
    );

    const threadDetailButton = getByRole('button', { name: /comment/i });
    fireEvent.click(threadDetailButton);

    expect(mockRouter).toMatchObject({
      asPath: ROUTE.threadsByID(mockThread.id),
    });
  });
});
