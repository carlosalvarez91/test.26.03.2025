export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: string;
}

export interface Template {
  id: string;
  name: string;
  alignment: 'LEFT' | 'CENTER' | 'RIGHT';
}

export interface Row {
  id: string;
  products: Product[];
  templateId: string | null;
}

export interface Grid {
  id?: string;
  rows: Row[];
}
