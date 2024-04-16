import React from 'react';
import { StoryFn } from '@storybook/react';
import ThreadBox from '@/containers/ThreadsPage/ThreadBox';
import { ThreadsWithUserType } from '@/types/threads-responses.interface';
import { ProfileResponsesType } from '@/types/profile-responses.interface';
import TestProvider from '@/provider/TestProvider';

const stories = {
  title: 'ThreadBox',
  component: ThreadBox,
};

export default stories;

const Template: StoryFn<{
  thread: ThreadsWithUserType;
  profile?: ProfileResponsesType;
}> = ({ thread, profile }) => (
  <TestProvider>
    <ThreadBox thread={thread} profile={profile} />
  </TestProvider>
);

export const Default = Template.bind({});
Default.args = {
  thread: {
    id: 'thread-01',
    title: 'Thread Title',
    body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry`s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    createdAt: '2023-01-29T07:30:45Z',
    user: {
      id: 'user-001',
      name: 'user 001',
      avatar: 'https://ui-avatars.com/api/?name=User 001&background=random',
      email: 'user01@mail.com',
    },
    category: 'my-category',
    upVotesBy: [],
    downVotesBy: ['user-002'],
    totalComments: 0,
    ownerId: 'user-001',
  },
  profile: {
    id: 'user-001',
    name: 'user 001',
    avatar: 'https://ui-avatars.com/api/?name=User 001&background=random',
    email: 'user01@mail.com',
  },
};
