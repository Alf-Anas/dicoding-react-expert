import { render } from '@testing-library/react';
import Footer from './Footer';
import matchers from '@testing-library/jest-dom/matchers';

// Using require to handle ts error
const { expect, describe, it } = require('@jest/globals');
// IMPORTANT to extend expect with jest-dom matchers
expect.extend(matchers);

/**
 * test scenario for Footer Component
 *
 * - Footer Component
 *  - renders the current year and link correctly
 *
 */

describe('Footer Component', () => {
  it('renders the current year and link correctly', () => {
    const { getByText } = render(<Footer />);

    // Check if the footer text contains the current year
    const thisYear = new Date().getFullYear();
    expect(getByText(new RegExp(`${thisYear}`))).toBeInTheDocument();

    // Check if the footer text contains the correct link
    const linkElement = getByText('GeoIT Developer');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.closest('a')).toHaveAttribute(
      'href',
      'https://geoit.dev',
    );
    expect(linkElement.closest('a')).toHaveAttribute('target', '_blank');
  });
});
