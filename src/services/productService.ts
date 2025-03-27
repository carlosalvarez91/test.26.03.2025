import { Product } from '../types';

// Mock product data
const mockProducts: Record<string, Product> = {
  p1: {
    id: 'p1',
    name: 'Blue Jean',
    imageUrl:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500',
    price: '36,87 EUR',
  },
  p2: {
    id: 'p2',
    name: 'White T-Shirt',
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500',
    price: '19,95 EUR',
  },
  p3: {
    id: 'p3',
    name: 'Black Dress',
    imageUrl:
      'https://images.unsplash.com/photo-1551803091-e20673f15770?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500',
    price: '49,99 EUR',
  },
  p4: {
    id: 'p4',
    name: 'Leather Jacket',
    imageUrl:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500',
    price: '89,95 EUR',
  },
  p5: {
    id: 'p5',
    name: 'Floral Skirt',
    imageUrl:
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500',
    price: '29,95 EUR',
  },
  p6: {
    id: 'p6',
    name: 'Striped Shirt',
    imageUrl:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500',
    price: '25,99 EUR',
  },
  p7: {
    id: 'p7',
    name: 'Denim Shorts',
    imageUrl:
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500',
    price: '22,95 EUR',
  },
  p8: {
    id: 'p8',
    name: 'Knit Sweater',
    imageUrl:
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500',
    price: '45,95 EUR',
  },
  p9: {
    id: 'p9',
    name: 'Cargo Pants',
    imageUrl:
      'https://images.unsplash.com/photo-1517438476312-10d79c077509?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500',
    price: '39,95 EUR',
  },
};

// Mock API call to get products by IDs
export const getProductsByIds = async (ids: string[]): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Return products that match the requested IDs
  return ids.map(id => mockProducts[id]).filter(Boolean);
};

// Function to get all available products (for demo purposes)
export const getAllProducts = async (): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  return Object.values(mockProducts);
};
