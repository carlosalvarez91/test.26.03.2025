import { forwardRef } from 'react';
import { Product } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SOURCE_TYPES, ITEM_TYPES } from '../constants';

type SourceType = typeof SOURCE_TYPES[keyof typeof SOURCE_TYPES];

interface ProductCardProps {
  product: Product;
  isDragging?: boolean;
  source?: SourceType;
  rowId?: string;
}

const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, isDragging, source, rowId }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          relative flex flex-col p-2 border rounded-md shadow-sm bg-white
          ${isDragging ? 'opacity-50' : 'opacity-100'}
          transition-all duration-200 hover:shadow-md
        `}
        data-product-id={product.id}
        data-source={source}
        data-row-id={rowId}
      >
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-md mb-2">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <h3 className="font-medium text-sm">{product.name}</h3>
        <p className="text-sm text-gray-700">{product.price}</p>
      </div>
    );
  }
);

ProductCard.displayName = 'ProductCard';

export default ProductCard;

interface DraggableProductCardProps {
  product: Product;
  source: SourceType;
  rowId?: string;
}

export const DraggableProductCard = ({ product, source, rowId }: DraggableProductCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: product.id,
    data: {
      type: ITEM_TYPES.PRODUCT,
      product,
      source,
      rowId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="touch-manipulation"
      {...attributes}
      {...listeners}
    >
      <ProductCard product={product} isDragging={isDragging} source={source} rowId={rowId} />
    </div>
  );
};
