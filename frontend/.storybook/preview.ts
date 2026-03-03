import type { Preview } from '@storybook/react-vite';
import { createElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import '@app/styles/global.css';

const preview: Preview = {
  decorators: [
    (Story) => createElement(MemoryRouter, null, createElement(Story))
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    a11y: {
      test: 'error'
    }
  }
};

export default preview;
