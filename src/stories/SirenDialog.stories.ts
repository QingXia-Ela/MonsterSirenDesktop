import type { Meta, StoryObj } from "@storybook/react";

import SirenDialog from "./SirenDialog";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "SirenDialog",
  component: SirenDialog,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  argTypes: {},
} satisfies Meta<typeof SirenDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    title: "测试模态框",
    children: "详见 src/stories/SirenDialog/index.tsx",
  },
};
