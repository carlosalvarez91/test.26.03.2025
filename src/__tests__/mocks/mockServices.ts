import { Product, Template, Grid } from '../../types';
import { mockProducts, mockTemplates, mockGridWithRows, mockServiceResponses } from './mockData';

// Mock implementations for service functions
export const mockGetProductsByIds = jest.fn().mockImplementation(() => Promise.resolve(mockProducts.slice(0, 3)));
export const mockGetAllProducts = jest.fn().mockImplementation(() => Promise.resolve(mockProducts));
export const mockGetTemplates = jest.fn().mockImplementation(() => Promise.resolve(mockTemplates));
export const mockSaveGrid = jest.fn().mockImplementation(() => Promise.resolve(mockServiceResponses.saveGridSuccess));

// Mock service modules
jest.mock('../../services/productService', () => ({
  getProductsByIds: mockGetProductsByIds,
  getAllProducts: mockGetAllProducts,
}));

jest.mock('../../services/templateService', () => ({
  getTemplates: mockGetTemplates,
  saveGrid: mockSaveGrid,
}));

// Add a dummy test to prevent Jest from complaining
describe('Mock Services', () => {
  it('should have mock services', () => {
    expect(mockGetProductsByIds).toBeDefined();
    expect(mockGetAllProducts).toBeDefined();
    expect(mockGetTemplates).toBeDefined();
    expect(mockSaveGrid).toBeDefined();
  });
});
