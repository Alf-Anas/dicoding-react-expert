import React from 'react';
import { StoryFn } from '@storybook/react';
import TestProvider from '@/provider/TestProvider';
import CommentBox from '@/containers/ThreadsPage/DetailPage/CommentBox';

const stories = {
  title: 'CommentBox',
  component: CommentBox,
};

export default stories;

const Template: StoryFn<{
  threadId: string;
}> = ({ threadId }) => (
  <TestProvider>
    <CommentBox threadId={threadId} />
  </TestProvider>
);

export const Default = Template.bind({});
Default.args = {
  threadId: 'thread-01',
};
