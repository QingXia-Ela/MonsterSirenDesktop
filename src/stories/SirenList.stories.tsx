import type { Meta, StoryObj } from '@storybook/react';

import SirenList from './SirenList';

const meta = {
  title: 'SirenList',
  component: SirenList,
} satisfies Meta<typeof SirenList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
};
