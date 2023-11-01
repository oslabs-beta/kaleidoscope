import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('App component', () => {
  it('renders the NewHome component', () => {
    const { getByTestId } = render(<App />);
    const newHomeComponent = getByTestId('new-home');
    expect(newHomeComponent).toBeInTheDocument();
  });
});