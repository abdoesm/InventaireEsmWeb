export interface Adjustement {
    id: number;
    article_id: number;
    adjustment_date: string;  // ISO format like "2024-04-07"
    quantity: number;
    adjustment_type: "increase" | "decrease" ;  // optional union type (if consistent)
  }
  