import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/models/cart';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) { this.product = { image: "", id: "", name: "", price: 0, description: "", features: [], reviews: [], category: "" } }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id)
      this.productService.getProduct(id).subscribe(product => {
        this.product = product;
      });
  }

  addToCart(product: Product) {
    const cartItem: CartItem = {
      id: product.id,
      imageUrl: product.image,
      name: product.name,
      price: product.price,
      quantity: 1
    };
    this.cartService.addCartItem(cartItem);
  }
}
