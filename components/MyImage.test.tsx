import { render } from '@testing-library/react';
import MyImage from './MyImage';
import matchers from '@testing-library/jest-dom/matchers';

// Using require to handle ts error
const { expect, describe, it } = require('@jest/globals');
// IMPORTANT to extend expect with jest-dom matchers
expect.extend(matchers);

/**
 * test scenario for MyImage Component
 *
 * - MyImage Component
 *  - renders with correct attributes
 *
 */

describe('MyImage Component', () => {
  it('renders with correct attributes', () => {
    // Define props
    const alt = 'My Logo';
    const src = './img/logo.png';
    const id = 'logo';
    const srcSet = './img/logo.png 2x';
    const className = 'image-class';
    const style = { border: '1px solid black' };
    const width = 200;
    const height = 150;

    // Render the component with props
    const { getByAltText } = render(
      <MyImage
        alt={alt}
        src={src}
        id={id}
        srcSet={srcSet}
        className={className}
        style={style}
        width={width}
        height={height}
      />,
    );

    // Get the rendered img element
    const imgElement = getByAltText(alt);

    // Assert that the img element has the correct attributes
    expect(imgElement).toHaveAttribute('src', src);
    expect(imgElement).toHaveAttribute('srcSet', srcSet);
    expect(imgElement).toHaveAttribute('id', id);
    expect(imgElement).toHaveAttribute('width', width.toString());
    expect(imgElement).toHaveAttribute('height', height.toString());
    expect(imgElement).toHaveAttribute('alt', alt);
    expect(imgElement).toHaveClass(className);
    expect(imgElement).toHaveStyle({ border: '1px solid black' });
    expect(imgElement).toHaveAttribute('loading', 'lazy');
  });
});
