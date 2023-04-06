import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from 'src/app/models/cart';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems$: Observable<CartItem[]>;
  totalPrice: number = 0;
  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.cartItems$;
    this.cartService.total$.pipe().subscribe(res => {
      this.totalPrice = res.totalPrice;
    });
  }

  ngOnInit(): void {

  }

  updateCartItem(item: CartItem) {
    this.cartService.updateCartItem(item);
  }

  removeCartItem(itemId: string) {
    this.cartService.removeCartItem(itemId);
  }
}
