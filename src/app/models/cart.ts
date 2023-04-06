import { Product } from "./product";

export interface Cart {
    id: string;
    userId: string;
    items: CartItem[];
}

export interface CartItem {
    id: string,
    name: string,
    price: number,
    quantity: number,
    imageUrl: string
}