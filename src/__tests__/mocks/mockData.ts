import { Product, Template, Grid } from '../../types';

export const mockProducts: Product[] = [
  {
    id: 'product-1',
    name: 'Product 1',
    price: '$19.99',
    imageUrl: '/images/product1.jpg',
  },
  {
    id: 'product-2',
    name: 'Product 2',
    price: '$29.99',
    imageUrl: '/images/product2.jpg',
  },
  {
    id: 'product-3',
    name: 'Product 3',
    price: '$39.99',
    imageUrl: '/images/product3.jpg',
  },
  {
    id: 'product-4',
    name: 'Product 4',
    price: '$49.99',
    imageUrl: '/images/product4.jpg',
  },
];

export const mockTemplates: Template[] = [
  {
    id: 'template-1',
    name: 'Left Aligned',
    alignment: 'LEFT',
  },
  {
    id: 'template-2',
    name: 'Center Aligned',
    alignment: 'CENTER',
  },
  {
    id: 'template-3',
    name: 'Right Aligned',
    alignment: 'RIGHT',
  },
];

export const mockEmptyGrid: Grid = {
  rows: [],
};

export const mockGridWithRows: Grid = {
  rows: [
    {
      id: 'row-1',
      templateId: 'template-1',
      products: [mockProducts[0], mockProducts[1]],
    },
    {
      id: 'row-2',
      templateId: 'template-2',
      products: [mockProducts[2]],
    },
  ],
};

// Mock service responses
export const mockServiceResponses = {
  saveGridSuccess: { success: true, id: 'grid-123' },
};

// Add a dummy test to prevent Jest from complaining
describe('Mock Data', () => {
  it('should have mock products', () => {
    expect(mockProducts.length).toBeGreaterThan(0);
  });
});
