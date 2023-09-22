import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import Input from '../Input'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Input',
  component: Input,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {}
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

const InputStory = () => {
  const [value, setValue] = useState('')

  return <Input label="Label" name="name" value={value} onChange={(e) => { setValue(e.target.value) }}/>
}

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {} as any,
  render: () => <InputStory />
}
