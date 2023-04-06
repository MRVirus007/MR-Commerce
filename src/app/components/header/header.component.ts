import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public user: User;
  public cartItemsCount: number = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {
    this.user = {
      uid: "",
      email: "",
      username: "",
      displayName: ""
    }
    this.cartService.cartItems$.pipe().subscribe(cartItems => {
      this.cartItemsCount = cartItems.length;
    });
  }

  ngOnInit() {
    this.authService.getAuthState().subscribe(user => {
      this.user = user;
    });
  }

  public logout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }

}
