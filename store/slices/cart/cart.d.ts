import {Product} from '../product/product';

interface specificationsProps {
  fieldName: string;
  fieldValue: string;
}
interface artWorkFilesProps {
  fileName: string;
  fileType: string;
  fileUrl: string;
}
interface CartItem {
  product: Product;
  itemsQuantity: number;
  calculatePriceForQuantity: number;
  totalPrice: number;
  specifications: specificationsProps[];
  artWorkFiles: artWorkFilesProps[];
}

export interface CartInitialState {
  cartItems: CartItem[];
  sidebarCartOpen: boolean;
  isCartModalOpen: boolean;
}
