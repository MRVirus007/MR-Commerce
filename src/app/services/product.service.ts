import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, Query } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private firestore: AngularFirestore) { }

  // Get all products
  getProducts(startAfter: any, pageSize: number): Observable<Product[]> {
    return this.firestore.collection('products', ref => ref.orderBy('name').startAfter(startAfter).limit(pageSize))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Product;
          data.id = a.payload.doc.id;
          return { ...data };
        }))
      );
  }
  getProduct(id: string): Observable<Product> {
    const productDoc = this.firestore.collection('products').doc(id);
    return productDoc.get().pipe(
      map(doc => {
        if (!doc.exists) {
          throw new Error('Product not found');
        } else {
          const data = doc.data() as Product;
          data.id = doc.id
          return { ...data };
        }
      })
    );
  }

  getProductsByCategory(category: string, startAfter?: any): Observable<any[]> {
    let query = this.firestore.collection('products', ref => ref.where('category', '==', category).orderBy('price').startAt(startAfter));
    return query.valueChanges();
  }
}
