// Source types
export const SOURCE_TYPES = {
  AVAILABLE: 'available',
  ROW: 'row',
};

// Item types
export const ITEM_TYPES = {
  PRODUCT: 'product',
  ROW: 'row',
  AVAILABLE_PRODUCTS: 'available-products',
};

// Query keys
export const QUERY_KEYS = {
  GRID_DATA: 'gridData',
  SAVE_GRID: 'saveGrid',
};

// Maximum products per row
export const MAX_PRODUCTS_PER_ROW = 3;

// Zoom levels
export const ZOOM_LEVELS = {
  MIN: 0.5,
  MAX: 2,
  DEFAULT: 1,
  STEP: 0.1,
};

// Error messages
export const ERROR_MESSAGES = {
  LOAD_DATA_FAILED: 'Failed to load data. Please try again.',
  SAVE_GRID_FAILED: 'Failed to save grid. Please try again.',
  TEMPLATE_REQUIRED: 'All rows must have a template assigned before saving.',
  PRODUCTS_REQUIRED: 'All rows must have at least one product before saving.',
  ROW_VALIDATION: 'All rows must have 1-3 products and a template assigned',
};
