
  
export interface Article {
  id?: number;
  name: string;
  unite: string;
  remarque: string;
  description: string;
  idCategory: number;
  minQuantity: number;
  totalQuantity?: number;
  last_edited?: string;
}
