'use client';
import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  MeasuringStrategy,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useGridContext } from '../context/GridContext';
import GridRow from './GridRow';
import ProductCard, { DraggableProductCard } from './ProductCard';
import { Product } from '../types';
import { 
  SOURCE_TYPES, 
  ITEM_TYPES, 
  ZOOM_LEVELS, 
  ERROR_MESSAGES 
} from '../constants';

const GridEditor = () => {
  const {
    availableProducts,
    grid,
    templates,
    loading,
    error,
    zoomLevel,
    setZoomLevel,
    addRow,
    moveRow,
    moveProduct,
    saveCurrentGrid,
  } = useGridContext();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<{
    type: string;
    row?: any;
    product?: Product;
    source?: string;
  } | null>(null);

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    // Store the active item data
    if (active.data.current?.type === ITEM_TYPES.ROW) {
      setActiveItem({ type: ITEM_TYPES.ROW, row: active.data.current.row });
    } else if (active.data.current?.type === ITEM_TYPES.PRODUCT) {
      setActiveItem({
        type: ITEM_TYPES.PRODUCT,
        product: active.data.current.product,
        source: active.data.current.source,
      });
    }
  };

  // Handle drag over for product sorting within rows
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over || !over.data.current) return;

    // Skip if it's a row being dragged
    if (active.data.current?.type === ITEM_TYPES.ROW) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Skip if dragging over itself
    if (activeId === overId) return;

    // If dragging a product over a row
    if (over.data.current.type === ITEM_TYPES.ROW) {
      // Handle this case in dragEnd
      return;
    }

    // If dragging a product over another product
    if (over.data.current.type === ITEM_TYPES.PRODUCT) {
      // Handle in dragEnd
      return;
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActiveItem(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle row reordering
    if (active.data.current?.type === ITEM_TYPES.ROW && over.data.current?.type === ITEM_TYPES.ROW) {
      const activeIndex = grid.rows.findIndex(row => row.id === activeId);
      const overIndex = grid.rows.findIndex(row => row.id === overId);

      if (activeIndex !== overIndex) {
        moveRow(activeIndex, overIndex);
      }
    }
    // Handle product moving
    else if (active.data.current?.type === ITEM_TYPES.PRODUCT) {
      const productId = activeId;
      const sourceType = active.data.current.source;
      let sourceRowId: string | null = null;

      // Determine source (available products or a row)
      if (sourceType === SOURCE_TYPES.AVAILABLE) {
        sourceRowId = null;
      } else if (sourceType === SOURCE_TYPES.ROW) {
        sourceRowId = active.data.current.rowId;
      }

      // Determine destination
      let destinationRowId: string | null = null;
      let destinationIndex: number | undefined = undefined;

      if (over.data.current?.type === ITEM_TYPES.ROW) {
        // Dropping onto a row
        destinationRowId = overId;
        // Append to end of row
        destinationIndex = undefined;
      } else if (over.data.current?.type === ITEM_TYPES.PRODUCT) {
        // Dropping onto another product
        if (over.data.current.source === SOURCE_TYPES.AVAILABLE) {
          // Dropping onto an available product - return to available
          destinationRowId = null;
        } else {
          // Dropping onto a row product
          destinationRowId = over.data.current.rowId;
          const overProductIndex =
            grid.rows
              .find(row => row.id === over.data.current?.rowId)
              ?.products.findIndex(p => p.id === overId) ?? -1;

          if (overProductIndex !== -1) {
            destinationIndex = overProductIndex;
          }
        }
      } else if (over.id === ITEM_TYPES.AVAILABLE_PRODUCTS) {
        // Dropping back to available products
        destinationRowId = null;
      }
      // Move the product
      moveProduct(sourceRowId, destinationRowId, productId, destinationIndex);
    }

    setActiveId(null);
    setActiveItem(null);
  };

  // Handle saving the grid
  const handleSave = async () => {
    // Check if all rows have templates assigned
    const hasUnassignedTemplates = grid.rows.some(row => row.templateId === null);
    const hasEmptyRows = grid.rows.some(row => row.products.length === 0);

    if (hasUnassignedTemplates) {
      alert(ERROR_MESSAGES.TEMPLATE_REQUIRED);
      return;
    }

    if (hasEmptyRows) {
      alert(ERROR_MESSAGES.PRODUCTS_REQUIRED);
      return;
    }

    const result = await saveCurrentGrid();

    if (result) {
      alert(`Grid saved successfully! ID: ${result.id}`);
    }
  };

  // Handle zoom in/out
  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + ZOOM_LEVELS.STEP, ZOOM_LEVELS.MAX));
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - ZOOM_LEVELS.STEP, ZOOM_LEVELS.MIN));
  };

  const handleResetZoom = () => {
    setZoomLevel(ZOOM_LEVELS.DEFAULT);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-black">ZARA Product Grid Editor</h1>
        <p className="text-gray-600">
          Create and organize product rows with different alignment templates
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-black"> Loading...</div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          measuring={{
            droppable: {
              strategy: MeasuringStrategy.Always,
            },
          }}
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left side - Available Products */}
            <div className="lg:w-1/3">
              <div className="bg-white border rounded-lg p-4 mb-4">
                <h2 className="text-xl font-semibold mb-4">Available Products</h2>
                <div
                  id="available-products"
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3"
                  data-type="available-products"
                  data-droppable-id="available-products"
                >
                  {availableProducts.map(product => (
                    <div key={product.id}>
                      <DraggableProductCard product={product} source="available" />
                    </div>
                  ))}

                  {availableProducts.length === 0 && (
                    <div className="col-span-full py-8 text-center text-gray-500">
                      No available products
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right side - Grid Editor */}
            <div className="lg:w-2/3 flex flex-col gap-4">
              <div className="bg-white border rounded-lg p-6 overflow-auto">
                <div className="flex flex-row justify-end items-center gap-3 mb-4">
                  <button
                    onClick={addRow}
                    className="bg-black text-white px-4 py-2 rounded-md w-34 hover:bg-gray-700"
                  >
                    Add New Row
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-black text-white px-4 py-2 rounded-md w-34 hover:bg-gray-700"
                  >
                    Save Grid
                  </button>

                  <div className="">
                    <div className="flex items-center">
                      <button
                        onClick={handleZoomOut}
                        className="bg-black p-2 rounded-l-md hover:bg-gray-700"
                        aria-label="Zoom out"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                      <button
                        onClick={handleResetZoom}
                        className="bg-black px-2 py-2 border-l border-r border-gray-300"
                      >
                        {Math.round(zoomLevel * 100)}%
                      </button>
                      <button
                        onClick={handleZoomIn}
                        className="bg-black p-2 rounded-r-md hover:bg-gray-700"
                        aria-label="Zoom in"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  className="grid-editor-container"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'top left',
                    minHeight: '500px',
                    transition: 'transform 0.2s ease-in-out',
                  }}
                >
                  <SortableContext
                    items={grid.rows.map(row => row.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {grid.rows.map((row, index) => (
                      <GridRow key={row.id} row={row} index={index} templates={templates} />
                    ))}
                  </SortableContext>

                  {grid.rows.length === 0 && (
                    <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-md">
                      <p className="mb-4">No rows yet. Click "Add New Row" to get started.</p>
                      <p>Then drag products from the left panel into your rows.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p>Drag and drop products between rows. Each row can have 1-3 products.</p>
                <p>Assign a template to each row to control alignment.</p>
              </div>
            </div>
          </div>

          <DragOverlay>
            {activeId && activeItem ? (
              activeItem.type === ITEM_TYPES.ROW ? (
                <div className="opacity-80 bg-white border rounded-lg p-4 shadow-xl">
                  <div className="flex gap-4">
                    {activeItem.row.products.map((product: Product) => (
                      <div key={product.id} className="w-24">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                activeItem.product && (
                  <div className="opacity-80 scale-105 shadow-xl">
                    <ProductCard product={activeItem.product} />
                  </div>
                )
              )
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
};

export default GridEditor;
