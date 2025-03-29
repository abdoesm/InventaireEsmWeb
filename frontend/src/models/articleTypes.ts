
  
export interface Article {
  id_category: number;
  id?: number;
  name: string;
  unite: string;
  remarque: string;
  description: string;
  min_quantity: number;
  totalQuantity?: number;
  last_edited?: string;
}
