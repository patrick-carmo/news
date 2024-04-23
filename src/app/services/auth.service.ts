import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { firebaseError } from '../utils/errorFirebase';
import { NativeBiometric } from 'capacitor-native-biometric';
import { Capacitor } from '@capacitor/core';
import { StorageService } from './storage.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isNative: boolean = Capacitor.getPlatform() !== 'web' ? true : false;

  constructor(
    private auth: AngularFireAuth,
    public router: Router,
    private storage: StorageService,
  ) {
    GoogleAuth.initialize({
      clientId:
        '123060927074-5mks66l4aq435n1cv3g3mmnjfrass3u7.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    });
  }
  
  async performBiometricVerification() {
    try {
      const result = await NativeBiometric.isAvailable();

      if (!result.isAvailable) return 'Biometria não disponível';

      const credentials = await this.storage.getBiometricCredentials();

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
    } catch {
      return 'Erro interno do servidor';
    }
  }

  async createUser(email: string, password: string) {
    try {
      const { user } = await this.auth.createUserWithEmailAndPassword(
        email,
        password
      );

      if (!user) return 'Erro interno do servidor';

      user.sendEmailVerification();

      if (this.isNative) {
        this.storage.resetBiometricCredentials();
        this.storage.setBiometricPreferences(false);
      }

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
        this.storage.getBiometricCredentials().then((credentials) => {
          if (
            credentials.username !== email ||
            credentials.password !== password
          ) {
            this.storage.setBiometricPreferences(false);
            this.storage.resetBiometricCredentials();
            this.storage.setBiometricCredentials({ email, password });
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
      const signData = await GoogleAuth.signIn();
      const { idToken } = signData.authentication;

      const credential = firebase.auth.GoogleAuthProvider.credential(idToken);

      await this.auth.signInWithCredential(credential);

      return;
    } catch (error: any) {
      const message = 'Autenticação com foi Google cancelada';

      if (error.error) {
        if (
          error.error === 'popup_closed_by_user' ||
          error.error === 'access_denied'
        )
          return message;
      }

      if (error.code === '12501') return message;

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

      if (this.isNative) this.storage.resetBiometricCredentials();
      this.storage.setBiometricPreferences(false);

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
        this.storage.getBiometricCredentials().then((credentials) => {
          this.storage.setBiometricCredentials({
            email: credentials.username,
            password,
          });
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
          this.storage.getBiometricCredentials().then((credentials) => {
            this.storage.setBiometricCredentials({
              email,
              password: credentials.password,
            });
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
    return new Promise((resolve) => {
      return this.auth.user.subscribe((user) => {
        return resolve(user);
      });
    }) as any;
  }
}
