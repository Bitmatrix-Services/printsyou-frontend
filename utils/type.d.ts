export interface queryTypes {
  size: number;
  page: number;
  filter: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string;
  category?: string;
}

type Blog = {
  id: string;
  sequenceNumber: number;
  title: string;
  content: string;
};
