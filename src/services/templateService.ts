import { Template, Grid } from '../types';

// Mock template data
const mockTemplates: Template[] = [
  {
    id: 'template1',
    name: 'Left Alignment',
    alignment: 'LEFT',
  },
  {
    id: 'template2',
    name: 'Center Alignment',
    alignment: 'CENTER',
  },
  {
    id: 'template3',
    name: 'Right Alignment',
    alignment: 'RIGHT',
  },
];

// Mock API call to get all templates
export const getTemplates = async (): Promise<Template[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  return mockTemplates;
};

// Mock API call to get a template by ID
export const getTemplateById = async (id: string): Promise<Template | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  return mockTemplates.find(template => template.id === id);
};

// Mock API call to save a grid
export const saveGrid = async (grid: Grid): Promise<{ success: boolean; id: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Validate grid
  const isValid = grid.rows.every(
    row => row.products.length > 0 && row.products.length <= 3 && row.templateId !== null
  );

  if (!isValid) {
    throw new Error('Invalid grid: Each row must have 1-3 products and a template assigned');
  }

  // Return success response with a mock ID
  return {
    success: true,
    id: grid.id || `grid_${Date.now()}`,
  };
};
