import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';
import '@testing-library/jest-dom';
// const Child = () => {
//     throw new Error()
//   }

//   describe('Error Boundary', () => {
//     it(`should render error boundary component when there is an error`, () => {
//       const { getByText } = render(
//         <ErrorBoundary>
//           <Child />
//         </ErrorBoundary>
//       )
//       const errorMessage = getByText('Something went wrong.')
//       expect(errorMessage).toBeDefined()
//     })
//   })

describe('Error Boundary', () => {
  test('Error Boundary', () => {
    const ThrowError = () => {
      throw new Error('Test');
    };
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByTestId('errorboundary')).toBeVisible();
  });
});