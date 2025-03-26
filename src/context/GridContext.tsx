"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Template, Row, Grid } from '../types';
import { getProductsByIds, getAllProducts } from '../services/productService';
import { getTemplates, saveGrid } from '../services/templateService';
import { useSearchParams } from 'next/navigation';

interface GridContextProps {
  availableProducts: Product[];
  templates: Template[];
  grid: Grid;
  loading: boolean;
  zoomLevel: number;
  error: string | null;
  addRow: () => void;
  removeRow: (rowId: string) => void;
  moveRow: (fromIndex: number, toIndex: number) => void;
  updateRowTemplate: (rowId: string, templateId: string) => void;
  moveProduct: (
    sourceRowId: string | null, 
    destinationRowId: string | null, 
    productId: string,
    destinationIndex?: number
  ) => void;
  saveCurrentGrid: () => Promise<{ success: boolean; id: string } | null>;
  setZoomLevel: (level: number) => void;
}

const GridContext = createContext<GridContextProps | undefined>(undefined);

export const GridProvider = ({ children }: { children: ReactNode }) => {
  const searchParams = useSearchParams();
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [grid, setGrid] = useState<Grid>({ rows: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Load products and templates on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get product IDs from URL
        const productIds = searchParams.get('ids')?.split(',') || [];
        
        // If no product IDs in URL, load all products for demo purposes
        const productData = productIds.length > 0 
          ? await getProductsByIds(productIds)
          : await getAllProducts();
        
        const templateData = await getTemplates();
        
        setAvailableProducts(productData);
        setTemplates(templateData);
        
        // Initialize with empty grid (no rows)
        setGrid({ rows: [] });
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        setLoading(false);
        console.error('Error loading data:', err);
      }
    };
    
    fetchData();
  }, [searchParams]);

  // Add a new empty row
  const addRow = () => {
    setGrid(prevGrid => ({
      ...prevGrid,
      rows: [
        ...prevGrid.rows,
        {
          id: `row-${Date.now()}`,
          products: [],
          templateId: null
        }
      ]
    }));
  };

  // Remove a row
  const removeRow = (rowId: string) => {
    setGrid(prevGrid => {
      // Get products from the row being removed
      const rowToRemove = prevGrid.rows.find(row => row.id === rowId);
      const productsToReturn = rowToRemove?.products || [];
      
      // Add the products back to available products
      setAvailableProducts(prev => [...prev, ...productsToReturn]);
      
      // Filter out the row to remove
      const updatedRows = prevGrid.rows.filter(row => row.id !== rowId);
      
      return {
        ...prevGrid,
        rows: updatedRows
      };
    });
  };

  // Move a row from one position to another
  const moveRow = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    setGrid(prevGrid => {
      const newRows = [...prevGrid.rows];
      const [movedRow] = newRows.splice(fromIndex, 1);
      newRows.splice(toIndex, 0, movedRow);
      
      return {
        ...prevGrid,
        rows: newRows
      };
    });
  };

  // Update a row's template
  const updateRowTemplate = (rowId: string, templateId: string) => {
    setGrid(prevGrid => ({
      ...prevGrid,
      rows: prevGrid.rows.map(row => 
        row.id === rowId 
          ? { ...row, templateId } 
          : row
      )
    }));
  };

  // Move a product from available products to a row, or between rows
  const moveProduct = (
    sourceRowId: string | null, 
    destinationRowId: string | null, 
    productId: string,
    destinationIndex?: number
  ) => {
    console.log('moveProduct called with:', { sourceRowId, destinationRowId, productId, destinationIndex });
    
    // Case 1: Moving from available products to a row
    if (sourceRowId === null && destinationRowId !== null) {
      console.log('Case 1: Moving from available products to a row');
      // Find the product in available products
      const productIndex = availableProducts.findIndex(p => p.id === productId);
      if (productIndex === -1) {
        console.log('Product not found in available products');
        return;
      }
      
      // Get the product
      const product = availableProducts[productIndex];
      console.log('Found product:', product);
      
      // Check if product already exists in the destination row
      const destRowIndex = grid.rows.findIndex(row => row.id === destinationRowId);
      if (destRowIndex !== -1) {
        const productExists = grid.rows[destRowIndex].products.some(p => p.id === productId);
        if (productExists) {
          console.log('Product already exists in destination row, skipping');
          return;
        }
      }
      
      // Remove from available products
      setAvailableProducts(prev => {
        console.log('Removing product from available products');
        return prev.filter(p => p.id !== productId);
      });
      
      // Add to destination row
      setGrid(prevGrid => {
        console.log('Adding product to destination row');
        const newRows = [...prevGrid.rows];
        const destRowIndex = newRows.findIndex(row => row.id === destinationRowId);
        
        if (destRowIndex === -1) {
          console.log('Destination row not found');
          return prevGrid;
        }
        
        // Check again if product already exists in the destination row (for safety)
        const productExists = newRows[destRowIndex].products.some(p => p.id === productId);
        if (productExists) {
          console.log('Product already exists in destination row (double-check), skipping');
          return prevGrid;
        }
        
        // Insert at specified index or append to end
        if (destinationIndex !== undefined) {
          console.log('Inserting at specific index:', destinationIndex);
          newRows[destRowIndex].products.splice(destinationIndex, 0, product);
        } else {
          console.log('Appending to end of row');
          newRows[destRowIndex].products.push(product);
        }
        
        // If the row now has more than 3 products, move excess to available products
        if (newRows[destRowIndex].products.length > 3) {
          const excessProducts = newRows[destRowIndex].products.splice(3);
          setAvailableProducts(prev => [...prev, ...excessProducts]);
        }
        
        return {
          ...prevGrid,
          rows: newRows
        };
      });
    }
    // Case 2: Moving from a row to available products
    else if (sourceRowId !== null && destinationRowId === null) {
      console.log('Case 2: Moving from a row to available products');
      setGrid(prevGrid => {
        console.log('Removing product from source row');
        const newRows = [...prevGrid.rows];
        const sourceRowIndex = newRows.findIndex(row => row.id === sourceRowId);
        
        if (sourceRowIndex === -1) {
          console.log('Source row not found');
          return prevGrid;
        }
        
        // Find the product in the source row
        const productIndex = newRows[sourceRowIndex].products.findIndex(p => p.id === productId);
        if (productIndex === -1) {
          console.log('Product not found in source row');
          return prevGrid;
        }
        
        // Remove from source row
        const [product] = newRows[sourceRowIndex].products.splice(productIndex, 1);
        console.log('Removed product from source row:', product);
        
        // Add to available products
        setAvailableProducts(prev => {
          console.log('Adding product to available products');
          return [...prev, product];
        });
        
        return {
          ...prevGrid,
          rows: newRows
        };
      });
    }
    // Case 3: Moving between rows
    else if (sourceRowId !== null && destinationRowId !== null) {
      console.log('Case 3: Moving between rows');
      setGrid(prevGrid => {
        console.log('Moving product between rows');
        const newRows = [...prevGrid.rows];
        
        // Find source and destination rows
        const sourceRowIndex = newRows.findIndex(row => row.id === sourceRowId);
        const destinationRowIndex = newRows.findIndex(row => row.id === destinationRowId);
        
        if (sourceRowIndex === -1 || destinationRowIndex === -1) {
          console.log('Source or destination row not found');
          return prevGrid;
        }
        
        // Find the product in the source row
        const productIndex = newRows[sourceRowIndex].products.findIndex(p => p.id === productId);
        if (productIndex === -1) {
          console.log('Product not found in source row');
          return prevGrid;
        }
        
        // Remove from source row
        const [product] = newRows[sourceRowIndex].products.splice(productIndex, 1);
        console.log('Removed product from source row:', product);
        
        // Check if product already exists in the destination row
        const productExists = newRows[destinationRowIndex].products.some(p => p.id === productId);
        if (productExists) {
          console.log('Product already exists in destination row, skipping');
          return prevGrid;
        }
        
        // Insert at specified index or append to end
        if (destinationIndex !== undefined) {
          console.log('Inserting at specific index:', destinationIndex);
          newRows[destinationRowIndex].products.splice(destinationIndex, 0, product);
        } else {
          console.log('Appending to end of row');
          newRows[destinationRowIndex].products.push(product);
        }
        
        // If the destination row now has more than 3 products, move excess to available products
        if (newRows[destinationRowIndex].products.length > 3) {
          console.log('Destination row has more than 3 products, moving excess to available products');
          const excessProducts = newRows[destinationRowIndex].products.splice(3);
          setAvailableProducts(prev => {
            console.log('Adding excess products to available products');
            return [...prev, ...excessProducts];
          });
        }
        
        return {
          ...prevGrid,
          rows: newRows
        };
      });
    }
  };

  // Save the current grid
  const saveCurrentGrid = async () => {
    try {
      // Validate grid
      const isValid = grid.rows.every(row => 
        row.products.length > 0 && 
        row.products.length <= 3 && 
        row.templateId !== null
      );
      
      if (!isValid) {
        setError('All rows must have 1-3 products and a template assigned');
        return null;
      }
      
      setLoading(true);
      const result = await saveGrid(grid);
      setLoading(false);
      
      // Update grid with the new ID
      setGrid(prevGrid => ({
        ...prevGrid,
        id: result.id
      }));
      
      setError(null);
      return result;
    } catch (err) {
      setError('Failed to save grid. Please try again.');
      setLoading(false);
      console.error('Error saving grid:', err);
      return null;
    }
  };

  return (
    <GridContext.Provider
      value={{
        availableProducts,
        templates,
        grid,
        loading,
        error,
        zoomLevel,
        addRow,
        removeRow,
        moveRow,
        updateRowTemplate,
        moveProduct,
        saveCurrentGrid,
        setZoomLevel
      }}
    >
      {children}
    </GridContext.Provider>
  );
};

export const useGridContext = () => {
  const context = useContext(GridContext);
  if (context === undefined) {
    throw new Error('useGridContext must be used within a GridProvider');
  }
  return context;
};
