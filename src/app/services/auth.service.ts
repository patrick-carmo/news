import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { firebaseError } from '../utils/errorFirebase';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: AngularFireAuth, private router: Router) {}

  async createUser(name: string, email: string, password: string) {
    try {
      const user = await this.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      if (name) {
        await user.user?.updateProfile({ displayName: name });
      }

      return;
    } catch (error) {
      return firebaseError(error);
    }
  }

  async emailSignIn(email: string, password: string) {
    try {
      const user = await this.auth.signInWithEmailAndPassword(email, password);

      return user;
    } catch (error) {
      return firebaseError(error);
    }
  }

  async googleSignIn() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await this.auth.signInWithPopup(provider);

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

  async isLogged() {
    return new Promise((resolve, reject) => {
      return this.auth.authState.subscribe(
        (user) => {
          if (user) {
            this.refreshToken(user);
            resolve(true);
          } else {
            reject(false);
          }
        },
        () => {
          reject(false);
        }
      );
    });
  }

  async refreshToken(user: any) {
    try {
      await user?.getIdTokenResult(true);
      return true;
    } catch (error) {
      return null;
    }
  }

  getUser() {
    try {
      return this.auth.authState;
    } catch {
      return null;
    }
  }

  async getStorage(key: string) {
    try {
      const result = await Preferences.get({ key });
      return result.value;
    } catch (error) {
      return 'Erro interno do servidor';
    }
  }

  async setStorage(key: string, value: any) {
    try {
      await Preferences.set({ key, value });
      return;
    } catch (error) {
      return 'Erro interno do servidor';
    }
  }
}
