import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { firebaseError } from '../utils/firebase/errorFirebase';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public error: any;

  constructor(private auth: AngularFireAuth) {}

  async createUser(email: string, password: string) {
    try {
      await this.auth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
      this.error = firebaseError(error);
    }
  }

  async emailSignIn(email: string, password: string) {
    try {
      await this.auth.signInWithEmailAndPassword(email, password);
      return true;
    } catch (error) {
      this.error = firebaseError(error);
      return false;
    }
  }

  async googleSignIn() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await this.auth.signInWithPopup(provider);
    } catch (error) {
      this.error = firebaseError(error);
    }
  }

  async sigOut() {
    await this.auth.signOut();
  }

  async resetPassword(email: string) {
    try {
      await this.auth.sendPasswordResetEmail(email);
    } catch (error) {
      this.error = firebaseError(error);
    }
  }

  async updatePassword(password: string) {
    try {
      await this.auth.currentUser.then((user) => {
        user?.updatePassword(password);
      });
    } catch (error) {
      this.error = firebaseError(error);
    }
  }

  async updateEmail(email: string) {
    try {
      await this.auth.currentUser.then((user) => {
        user?.updateEmail(email);
      });
    } catch (error) {
      this.error = firebaseError(error);
    }
  }

  async getUser() {
    try {
      const user = await this.auth.currentUser;
      return user;
    } catch (error) {
      this.error = firebaseError(error);
      return null;
    }
  }
}
