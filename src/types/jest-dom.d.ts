import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(...classNames: string[]): R;
      toHaveValue(value: string | string[] | number): R;
    }
  }
}

// This allows TypeScript to recognize the custom screen method we added
declare module '@testing-library/react' {
  interface Screen {
    getByAttribute(attribute: string, value: string): HTMLElement;
  }
}

export {};
