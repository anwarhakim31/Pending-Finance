export interface User {
  _id?: string;
  fullname: string;
  photo?: string;
  phone?: string;
  store?: string;
}

export interface Products {
  _id?: number;
  name: string;
  price: number;
  discountPrice?: number;
  discountQuantity?: number;
}

export interface Record {
  _id?: string;
  date?: Date | null;
  type?: string;
  product?: string;
  quantity?: number | string;
  total?: number;
  groupId?: string;
  createdAt?: Date;
}

export interface GroupData {
  _id?: string;
  date: Date | null;
  total?: number | null;
  data: {
    type?: string;
    product?: string;
    quantity?: number | string;
  }[];
}
