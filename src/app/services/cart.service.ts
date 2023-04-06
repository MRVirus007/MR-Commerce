import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, scan, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { CartItem } from '../models/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private userId = this.authService.getToken()?.user_id;
  private userId$ = this.authService.getUserId();
  private cartItemsCollection$: Observable<AngularFirestoreCollection<CartItem>> = this.userId$.pipe(
    map(() => this.firestore.collection<CartItem>(`users/${this.userId}/cart`))
  );
  cartItems$ = this.cartItemsCollection$.pipe(
    switchMap(collection => collection.valueChanges({ idField: 'id' })),
    map(items => items.map(item => ({
      ...item
    })))
  );
  total$: Observable<{ totalPrice: number }> = this.cartItems$.pipe(
    scan((acc, items) => {
      const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
      return { totalPrice };
    }, { totalPrice: 0 })
  );
  cart$ = combineLatest([this.cartItems$, this.total$]).pipe(
    map(([items, { totalPrice }]) => {
      return items.map(item => ({ ...item, totalPrice })) as CartItem[];
    })
  );

  constructor(private authService: AuthService, private firestore: AngularFirestore) { }

  addCartItem(item: CartItem) {
    this.cartItemsCollection$.pipe(
      switchMap(collection => collection.doc(item.id).get())
    ).subscribe(doc => {
      if (doc.exists) {
        const existingItem = doc.data() as CartItem;
        existingItem.quantity += item.quantity;
        this.cartItemsCollection$.pipe(
          switchMap(collection => collection.doc(existingItem.id).update(existingItem))
        ).subscribe();
      } else {
        this.cartItemsCollection$.pipe(
          switchMap(collection => collection.doc(item.id).set(item))
        ).subscribe();
      }
    });
  }

  updateCartItem(item: CartItem) {
    this.cartItemsCollection$.pipe(
      switchMap(collection => collection.doc(item.id).update(item))
    ).subscribe();
  }

  removeCartItem(itemId: string) {
    this.cartItemsCollection$.pipe(
      switchMap(collection => collection.doc(itemId).delete())
    ).subscribe();
  }

  clearCart() {
    this.cartItems$.subscribe(items => {
      const batch = this.firestore.firestore.batch();
      items.forEach(item => {
        const docRef$ = this.cartItemsCollection$.pipe(
          map(collection => collection.doc(item.id).ref)
        );
        docRef$.subscribe(docRef => {
          batch.delete(docRef);
        });
      });
      batch.commit();
    });
  }

}
