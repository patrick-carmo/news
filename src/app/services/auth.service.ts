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
      await this.auth.createUserWithEmailAndPassword(
        email,
        password
      );

      return;
    } catch (error) {
      return firebaseError(error);
    }
  }

  async emailSignIn(email: string, password: string) {
    try {
      await this.auth.signInWithEmailAndPassword(email, password);

      return;
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

  async isLogged(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth.authState.subscribe(
        (user) => {
          if (user) {
            resolve(user);
          } else {
            reject('Usuário não logado');
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async getUser() {
    try {
      const user = await this.auth.currentUser;
      return user;
    } catch {
      return null;
    }
  }

  async getToken(key: string) {
    try {
      const token = await Preferences.get({ key });
      return token.value;
    } catch (error) {
      return 'Erro interno do servidor'
    }
  }

  async setToken(key: string, value: any) {
    try {
      await Preferences.set({ key, value });
      return;
    } catch (error) {
      return 'Erro interno do servidor'
    }
  }
}
