// Import the necessary libraries
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  user$: Observable<any>;
  private usersCollection: AngularFirestoreCollection<User>;
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          // If user is logged in, return the JWT token from Firebase
          return user.getIdToken();
        } else {
          // If user is not logged in, return an empty string
          return of('');
        }
      })
    );
    this.usersCollection = this.firestore.collection<User>('users');
  }

  getAuthState(): Observable<any> {
    return this.afAuth.authState;
  }

  async signUp(email: string, password: string, username: string): Promise<string | undefined> {
    try {
      // Check if email or username already exists
      const emailExists = await this.usersCollection.ref.where('email', '==', email).get();
      if (!emailExists.empty) {
        throw new Error('Email already exists');
      }
      const usernameExists = await this.usersCollection.ref.where('username', '==', username).get();
      if (!usernameExists.empty) {
        throw new Error('Username already exists');
      }

      const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      if (credential.user) {
        // Create a new document in the 'users' collection with the user's data
        const userData = { uid: credential.user.uid, email, username, displayName: username };
        await credential.user.updateProfile({
          displayName: username
        });
        await this.usersCollection.doc(credential.user.uid).set(userData);
        const token = await credential.user.getIdToken();
        localStorage.setItem('token', token);
        this.router.navigate(['/']);
      }
      return "";
    } catch (err: any) {
      //throw new Error('Error: ', err.message);
      return err.message;
    }
  }


  async login(email: string, password: string): Promise<string | undefined> {
    try {
      const credential = await this.afAuth.signInWithEmailAndPassword(email, password);
      if (credential.user) {
        const token = await credential.user.getIdToken();
        localStorage.setItem('token', token);
        this.router.navigate(['/']);
      }
      return "";
    } catch (err: any) {
      console.log(err);
      return err.message;
    }
  }

  async logout() {
    try {
      await this.afAuth.signOut();
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    } catch (err) {
      console.log(err);
    }
  }

  getToken() {
    const token = localStorage.getItem('token');
    return token ? jwt_decode<JwtPayload>(token) : null;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getUserName(): string | null {
    let displayName;
    this.afAuth.currentUser.then((user) => {
      displayName = user?.displayName;
    });
    return displayName ? displayName : null;
  }

  addToCart() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // User is logged in, add product to cart
      } else {
        // User is not logged in, redirect to login page
        this.router.navigate(['/login']);
      }
    });
  }

  getUserId(): Observable<string | null> {
    return from(this.afAuth.currentUser).pipe(
      map(user => {
        if (user) {
          return user.uid;
        } else {
          return null;
        }
      })
    );
  }
}
