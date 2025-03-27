import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductCard, { DraggableProductCard } from '../../components/ProductCard';
import { mockProducts } from '../mocks/mockData';
import { SOURCE_TYPES } from '../../constants';

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

describe('ProductCard', () => {
  const mockProduct = mockProducts[0];

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    // Check if product name and price are displayed
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.price)).toBeInTheDocument();
    
    // Check if image is displayed with correct src and alt
    const image = screen.getByAltText(mockProduct.name);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockProduct.imageUrl);
  });

  it('applies isDragging style when dragging', () => {
    render(<ProductCard product={mockProduct} isDragging={true} />);
    
    // The parent div should have opacity-50 class when dragging
    const productCard = screen.getByText(mockProduct.name).closest('div');
    expect(productCard).toHaveClass('opacity-50');
  });

  it('adds source and rowId data attributes', () => {
    const rowId = 'test-row-1';
    render(
      <ProductCard 
        product={mockProduct} 
        source="row" 
        rowId={rowId} 
      />
    );
    
    // Check if data attributes are set correctly
    const productCard = screen.getByText(mockProduct.name).closest('div');
    expect(productCard).toHaveAttribute('data-source', 'row');
    expect(productCard).toHaveAttribute('data-row-id', rowId);
  });
});

describe('DraggableProductCard', () => {
  const mockProduct = mockProducts[0];

  it('renders a draggable product card', () => {
    render(
      <DraggableProductCard 
        product={mockProduct} 
        source="available" 
      />
    );
    
    // Check if product name is displayed in the draggable wrapper
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    
    // Check if the wrapper has the touch-manipulation class for better touch handling
    const wrapper = screen.getByText(mockProduct.name).closest('.touch-manipulation');
    expect(wrapper).toBeInTheDocument();
  });

  it('passes source and rowId to the ProductCard', () => {
    const rowId = 'test-row-1';
    render(
      <DraggableProductCard 
        product={mockProduct} 
        source="row" 
        rowId={rowId} 
      />
    );
    
    // Check if data attributes are set correctly on the inner ProductCard
    const productCard = screen.getByText(mockProduct.name).closest('div');
    expect(productCard).toHaveAttribute('data-source', 'row');
    expect(productCard).toHaveAttribute('data-row-id', rowId);
  });
});
