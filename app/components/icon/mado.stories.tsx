import type { Meta, StoryObj } from '@storybook/react-vite';

import { Mado } from './mado';

const meta = {
  component: Mado,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Mado>;

export default meta;
type Story = StoryObj<typeof Mado>;

export const Base = {} satisfies Story;
