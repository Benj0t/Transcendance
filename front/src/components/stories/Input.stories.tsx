import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Input from '../Input';

const meta = {
  title: 'Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

const InputStory = () => {
  const [value, setValue] = useState('');

  return (
    <Input
      label="Label"
      name="name"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
    />
  );
};

export const Primary: Story = {
  args: {} as any,
  render: () => <InputStory />,
};
