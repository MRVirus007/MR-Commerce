import { TestBed } from '@angular/core/testing';

import { CartService } from './cart.service';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { fakeAsync } from '@angular/core/testing';
import { tick } from '@angular/core/testing';
import { of } from 'rxjs';

describe('CartService', () => {
  let service: CartService;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let firestoreSpy: jasmine.SpyObj<AngularFirestore>;
  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getUserId']);
    const firestorSpy = jasmine.createSpyObj('AngularFirestore', ['collection']);

    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: AuthService, useValue: authSpy },
        { provide: AngularFirestore, useValue: firestorSpy }
      ]
    });
    service = TestBed.inject(CartService);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    firestoreSpy = TestBed.inject(AngularFirestore) as jasmine.SpyObj<AngularFirestore>;
  });

  // it('should be created', () => {
  //   expect(service).toBeTruthy();
  // });
  describe('addCartItem', () => {
    it('should add item to cart if it does not exist', fakeAsync(() => {
      const item = {
        id: 'abc123',
        name: 'Test Item',
        price: 10,
        quantity: 1,
        imageUrl: 'https://testimage.com'
      };
      const collectionSpy = jasmine.createSpyObj('collection', ['doc', 'get', 'set']);
      const docSpy = jasmine.createSpyObj('doc', ['exists', 'data']);
      docSpy.exists.and.returnValue(false);
      collectionSpy.doc.withArgs(item.id).and.returnValue(docSpy);
      collectionSpy.doc.withArgs(item.id).set.and.returnValue(of(null));
      firestoreSpy.collection.and.returnValue(collectionSpy);
      authServiceSpy.getUserId.and.returnValue(of('user123'));

      service.addCartItem(item);

      tick();

      expect(collectionSpy.doc).toHaveBeenCalledWith(item.id);
      expect(collectionSpy.doc(item.id).set).toHaveBeenCalledWith(item);
    }));
  });
});
