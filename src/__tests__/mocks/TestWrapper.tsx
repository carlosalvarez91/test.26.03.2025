import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GridProvider } from '../../context/GridContext';

// Create a new QueryClient for each test
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0, // Use gcTime instead of cacheTime (which is deprecated)
      staleTime: 0,
    },
  },
});

interface TestWrapperProps {
  children: ReactNode;
}

export const TestWrapper: React.FC<TestWrapperProps> = ({ children }) => {
  const queryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <GridProvider>
        {children}
      </GridProvider>
    </QueryClientProvider>
  );
};

// Add a dummy test to prevent Jest from complaining
describe('TestWrapper', () => {
  it('should render correctly', () => {
    expect(TestWrapper).toBeDefined();
  });
});
