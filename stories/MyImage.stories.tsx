import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import MyImage, { Props } from '@/components/MyImage';

const stories: Meta = {
  title: 'MyImage',
  component: MyImage,
  argTypes: {
    alt: {
      description: 'The alternative text for the image',
      control: { type: 'text' },
    },
    src: {
      description: 'The source URL of the image',
      control: { type: 'text' },
    },
    id: {
      description: 'The ID attribute of the image element',
      control: { type: 'text' },
    },
    srcSet: {
      description: 'The source set for the image',
      control: { type: 'text' },
    },
    className: {
      description: 'The CSS class for styling the image',
      control: { type: 'text' },
    },
    style: {
      description: 'Inline styles for the image',
      control: { type: 'object' },
    },
    width: {
      description: 'The width of the image',
    },
    height: {
      description: 'The height of the image',
    },
  },
};

export default stories;

const Template: StoryFn<Props> = (args: Props) => <MyImage {...args} />;

export const Default = Template.bind({});
Default.args = {
  alt: 'Logo Image',
  src: './img/logo.png',
  width: 200,
  height: 200,
};
