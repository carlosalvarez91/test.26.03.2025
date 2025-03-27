import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Row, Template } from '../types';
import { DraggableProductCard } from './ProductCard';
import { useGridContext } from '../context/GridContext';
import { ITEM_TYPES, SOURCE_TYPES } from '../constants';

interface GridRowProps {
  row: Row;
  index: number;
  templates: Template[];
}

const GridRow = ({ row, index, templates }: GridRowProps) => {
  const { updateRowTemplate } = useGridContext();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
    data: {
      type: ITEM_TYPES.ROW,
      row,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Get the selected template
  const selectedTemplate = templates.find(t => t.id === row.templateId);

  // Determine alignment class based on template
  const getAlignmentClass = () => {
    if (!selectedTemplate) return 'justify-start'; // Default to left alignment

    switch (selectedTemplate.alignment) {
      case 'LEFT':
        return 'justify-start';
      case 'CENTER':
        return 'justify-center';
      case 'RIGHT':
        return 'justify-end';
      default:
        return 'justify-start';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative mb-6 p-4 border rounded-lg bg-white
        ${isDragging ? 'opacity-70 z-10 shadow-xl' : 'opacity-100 shadow-sm'}
        transition-all duration-200
      `}
      data-row-id={row.id}
      data-type={ITEM_TYPES.ROW}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="cursor-move p-2 hover:bg-gray-100 rounded-md"
          {...attributes}
          {...listeners}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        </div>

        <div className="flex items-center">
          <span className="mr-2 text-sm font-medium">Template:</span>
          <select
            value={row.templateId || ''}
            onChange={e => updateRowTemplate(row.id, e.target.value)}
            className="p-2 border rounded-md text-sm"
          >
            <option value="">Select template</option>
            {templates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={`flex gap-4 ${getAlignmentClass()}`}>
        {row.products.map(product => (
          <div key={product.id} className="w-1/3 max-w-[200px]">
            <DraggableProductCard product={product} source={SOURCE_TYPES.ROW} rowId={row.id} />
          </div>
        ))}

        {row.products.length === 0 && (
          <div className="w-full py-8 text-center text-gray-500 border-2 border-dashed rounded-md">
            Drop products here
          </div>
        )}
      </div>

      {selectedTemplate && (
        <div className="mt-2 text-xs text-gray-500">
          Template: {selectedTemplate.name} ({selectedTemplate.alignment})
        </div>
      )}
    </div>
  );
};

export default GridRow;
