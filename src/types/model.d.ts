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

export interface Record {
  id?: string;
  date?: Date | null;
  type?: string;
  product?: string;
  quantity?: number | string;
  total?: number;
  groupId?: string;
  createdAt?: Date;
}

export interface GroupData {
  id?: string;
  date: Date | null;
  total?: number | null;
  data: {
    type?: string;
    product?: string;
    quantity?: number | string;
  }[];
}
