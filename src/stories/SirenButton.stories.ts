import type { Meta, StoryObj } from '@storybook/react';

import Button from '@/components/Button';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'SirenButton',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'select' },
      description: '按钮尺寸选择',
    },
    decorate: {
      description: '按钮角落白色方块装饰',
    },
    theme: {
      options: ['primary'],
      control: { type: 'select' },
      description: '按钮主题选择',
    }
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    children: 'Button',
    theme: 'primary',
    decorate: false,
  },
};
