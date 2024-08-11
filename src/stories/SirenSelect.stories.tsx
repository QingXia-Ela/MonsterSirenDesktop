import type { Meta, StoryObj } from '@storybook/react';

import Select from '@/components/Select';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'SirenSelect',
  component: Select,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    value: 'test',
    placeholder: '请选择',
    // listHeight: '2.1rem',
    height: '2.8rem',
    closeAfterSelect: false,
    arrow: false,
    options: [
      { label: 'Ad Astra', value: '1' },
      { label: 'Operation Pyrite', value: '2' },
      { label: 'Missy you', value: '3' },
    ],
    addonListAfter: <div style={{ fontSize: '.4rem' }}>suffix</div>,
  },
};
