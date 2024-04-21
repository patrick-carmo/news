import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { firebaseError } from '../utils/errorFirebase';
import { NativeBiometric } from 'capacitor-native-biometric';
import { Capacitor } from '@capacitor/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private server: string = 'https://news-team-5.vercel.app/';

  isNative: boolean = Capacitor.getPlatform() !== 'web' ? true : false;

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private storage: StorageService
  ) {}

  async performBiometricVerification() {
    try {
      const result = await NativeBiometric.isAvailable();

      if (!result.isAvailable) return 'Biometria não disponível';

      const credentials = await this.getBiometricCredentials();

      if (!credentials)
        return 'A primeira autenticação deve ser feita manualmente';

      const verified = await NativeBiometric.verifyIdentity({
        title: 'Autenticação',
        maxAttempts: 5,
      })
        .then(() => true)
        .catch(() => false);

      if (!verified) return;

      return credentials;
    } catch (error: any) {
      return error.message;
    }
  }

  async setBiometricCredentials(email: string, password: string) {
    await NativeBiometric.setCredentials({
      server: this.server,
      username: email,
      password,
    });
  }

  async getBiometricCredentials() {
    const credentials = await NativeBiometric.getCredentials({
      server: this.server,
    });

    return credentials;
  }

  async resetBiometricCredentials() {
    await NativeBiometric.deleteCredentials({
      server: this.server,
    });
  }

  async createUser(email: string, password: string) {
    try {
      const { user } = await this.auth.createUserWithEmailAndPassword(
        email,
        password
      );

      if (!user) return 'Erro ao criar conta';

      user.sendEmailVerification();

      this.resetBiometricCredentials();
      this.storage.setBiometricPreferences(false);

      return;
    } catch (error) {
      return firebaseError(error);
    }
  }

  async emailSignIn(email: string, password: string) {
    try {
      const { user } = await this.auth.signInWithEmailAndPassword(
        email,
        password
      );

      if (!user?.emailVerified) {
        user?.sendEmailVerification();
        return 'Verifique seu e-mail para autenticar.';
      }

      if (this.isNative) {
        this.getBiometricCredentials().then((credentials) => {
          if (
            credentials.username !== email ||
            credentials.password !== password
          ) {
            this.storage.setBiometricPreferences(false);
            this.resetBiometricCredentials();
            this.setBiometricCredentials(email, password);
          }
        });
      }

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

      if (this.isNative) this.resetBiometricCredentials();

      return;
    } catch (error) {
      return firebaseError(error);
    }
  }

  async updatePassword(password: string) {
    try {
      const user = await this.auth.currentUser;

      if (user) await user.updatePassword(password);

      if (this.isNative) {
        this.getBiometricCredentials().then((credentials) => {
          this.setBiometricCredentials(credentials.username, password);
        });
      }

      return;
    } catch (error) {
      return firebaseError(error);
    }
  }

  async updateEmail(email: string) {
    try {
      await this.auth.currentUser.then((user) => {
        user?.updateEmail(email);

        if (this.isNative) {
          this.getBiometricCredentials().then((credentials) => {
            this.setBiometricCredentials(email, credentials.password);
          });
        }
      });
      return;
    } catch (error) {
      return firebaseError(error);
    }
  }

  async updateProfile(displayName: string, photoURL: string) {
    try {
      await this.auth.currentUser.then((user) => {
        user?.updateProfile({ displayName, photoURL });
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
    return this.auth.user;
  }
}
