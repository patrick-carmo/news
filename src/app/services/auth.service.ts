import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { firebaseError } from '../utils/firebase/errorFirebase';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: AngularFireAuth, private router: Router) {}

  async createUser(email: string, password: string) {
    try {
      const data = await this.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      await this.setToken(data);

      return;
    } catch (error) {
      return firebaseError(error);
    }
  }

  async emailSignIn(email: string, password: string) {
    try {
      const data = await this.auth.signInWithEmailAndPassword(email, password);
      await this.setToken(data);
      return;
    } catch (error) {
      return firebaseError(error);
    }
  }

  async googleSignIn() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const data = await this.auth.signInWithPopup(provider);
      await this.setToken(data);

      return;
    } catch (error) {
      return firebaseError(error);
    }
  }

  async signOut() {
    await this.auth.signOut();
    this.router.navigate(['/login']);
  }

  async resetPassword(email: string) {
    try {
      await this.auth.sendPasswordResetEmail(email);
      return;
    } catch (error) {
      return firebaseError(error);
    }
  }

  async updatePassword(password: string) {
    try {
      await this.auth.currentUser.then((user) => {
        user?.updatePassword(password);
      });
      return;
    } catch (error) {
      return firebaseError(error);
    }
  }

  async updateEmail(email: string) {
    try {
      await this.auth.currentUser.then((user) => {
        user?.updateEmail(email);
      });
      return;
    } catch (error) {
      return firebaseError(error);
    }
  }

  async verifyToken() {
    try {
      const token = await this.getToken();

      if (!token) {
        return this.router.navigate(['/login']);
      }

      const data = await this.auth.signInWithCustomToken(token);
      return await this.setToken(data);
    } catch (error) {
      return firebaseError(error);
    }
  }

  async getUser() {
    try {
      const user = await this.auth.currentUser;
      return user;
    } catch {
      return null;
    }
  }

  async getToken() {
    try {
      const token = await Preferences.get({ key: 'token' });
      return token.value;
    } catch (error) {
      return firebaseError(error);
    }
  }

  async setToken(data: any) {
    try {
      const token = await data.user?.getIdToken();
      if (token) await Preferences.set({ key: 'token', value: token });
      return;
    } catch (error) {
      return firebaseError(error);
    }
  }
}
