export interface User {
  id?: string;
  fullname: string;
  photo?: string;
  store: string;
}

export interface Products {
  id?: number;
  name: string;
  price: number;
  discountPrice?: number;
  discountQuantity?: number;
}
