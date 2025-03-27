import React from 'react';
import { render, screen } from '@testing-library/react';
import GridRow from '../../components/GridRow';
import { mockProducts, mockTemplates } from '../mocks/mockData';
import { TestWrapper } from '../mocks/TestWrapper';

// Mock the useSortable hook
jest.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

// Mock the GridContext
jest.mock('../../context/GridContext', () => {
  const originalModule = jest.requireActual('../../context/GridContext');
  return {
    ...originalModule,
    useGridContext: () => ({
      updateRowTemplate: jest.fn(),
    }),
  };
});

describe('GridRow', () => {
  const mockRow = {
    id: 'row-1',
    templateId: 'template-1',
    products: [mockProducts[0], mockProducts[1]],
  };

  it('renders row with correct template and products', () => {
    render(
      <TestWrapper>
        <GridRow row={mockRow} index={0} templates={mockTemplates} />
      </TestWrapper>
    );
    
    // Check if the row has the correct data attribute
    const rowElement = document.querySelector('[data-row-id="row-1"]');
    expect(rowElement).toBeInTheDocument();
    
    // Check if template info is displayed
    expect(screen.getByText(/Template: Left Aligned/)).toBeInTheDocument();
    
    // Check if products are displayed
    expect(screen.getByText(mockProducts[0].name)).toBeInTheDocument();
    expect(screen.getByText(mockProducts[1].name)).toBeInTheDocument();
  });

  it('renders empty row with placeholder', () => {
    const emptyRow = {
      id: 'row-empty',
      templateId: 'template-1',
      products: [],
    };
    
    render(
      <TestWrapper>
        <GridRow row={emptyRow} index={0} templates={mockTemplates} />
      </TestWrapper>
    );
    
    // Check if empty state message is displayed
    expect(screen.getByText('Drop products here')).toBeInTheDocument();
  });

  it('applies correct alignment class based on template', () => {
    // Test with LEFT alignment
    const leftRow = {
      ...mockRow,
      templateId: 'template-1', // LEFT alignment
    };
    
    const { rerender } = render(
      <TestWrapper>
        <GridRow row={leftRow} index={0} templates={mockTemplates} />
      </TestWrapper>
    );
    
    // Check if products container has justify-start class
    let productsContainer = document.querySelector('.flex.gap-4');
    expect(productsContainer).toHaveClass('justify-start');
    
    // Test with CENTER alignment
    const centerRow = {
      ...mockRow,
      templateId: 'template-2', // CENTER alignment
    };
    
    rerender(
      <TestWrapper>
        <GridRow row={centerRow} index={0} templates={mockTemplates} />
      </TestWrapper>
    );
    
    // Check if products container has justify-center class
    productsContainer = document.querySelector('.flex.gap-4');
    expect(productsContainer).toHaveClass('justify-center');
    
    // Test with RIGHT alignment
    const rightRow = {
      ...mockRow,
      templateId: 'template-3', // RIGHT alignment
    };
    
    rerender(
      <TestWrapper>
        <GridRow row={rightRow} index={0} templates={mockTemplates} />
      </TestWrapper>
    );
    
    // Check if products container has justify-end class
    productsContainer = document.querySelector('.flex.gap-4');
    expect(productsContainer).toHaveClass('justify-end');
  });

  it('renders template selector with correct options', () => {
    render(
      <TestWrapper>
        <GridRow row={mockRow} index={0} templates={mockTemplates} />
      </TestWrapper>
    );
    
    // Find the template selector
    const templateSelector = document.querySelector('select');
    expect(templateSelector).toBeInTheDocument();
    
    // Check if it has the correct value
    expect(templateSelector).toHaveValue('template-1');
    
    // Check if all template options are available
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(mockTemplates.length + 1); // +1 for the default "Select template" option
    
    // Check if template names are displayed
    mockTemplates.forEach(template => {
      expect(screen.getByText(template.name)).toBeInTheDocument();
    });
  });
});
