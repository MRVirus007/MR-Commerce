export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    features: string[];
    reviews: Review[];
    category: string;
}

export interface Review {
    user: string;
    comment: string;
    rating: number;
}