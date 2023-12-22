import type { Meta, StoryObj } from '@storybook/react';

import Button from '../Button';

const meta = {
  title: 'Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    onClick: () => {
      console.log('Je clique');
    },
    label: 'Mon Bouton',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Bouton disabled',
    disabled: true,
    onClick: () => {
      console.log('Je clique');
    },
  },
};
