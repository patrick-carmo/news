import { UserPreferencesService } from './../storage/user-preferences.service';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { firebaseError } from '../../utils/errorFirebase';
import { NativeBiometric } from 'capacitor-native-biometric';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import firebase from 'firebase/compat/app';
import { Subscription } from 'rxjs';
import { UtilsService } from '../utils.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  router = inject(Router);
  private auth = inject(AngularFireAuth);
  private userPrefService = inject(UserPreferencesService);
  private utils = inject(UtilsService);

  isNative: boolean = Capacitor.getPlatform() !== 'web';
  private user: firebase.User | null = null;
  private userState$: Subscription | undefined;

  constructor() {
    GoogleAuth.initialize({
      clientId:
        '123060927074-5mks66l4aq435n1cv3g3mmnjfrass3u7.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    });

    this.userState$ = this.auth.authState.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.userState$?.unsubscribe();
  }

  get authState() {
    return this.auth.authState;
  }

  get getUser() {
    return this.user;
  }

  async performBiometricVerification() {
    try {
      const result = await NativeBiometric.isAvailable();

      if (!result.isAvailable) return 'Biometria não disponível';

      const credentials = await this.userPrefService.getBiometricCredentials();
      if (typeof credentials === 'string') return credentials;

      const { username, password } = credentials;

      if (!username || !password)
        return 'A primeira autenticação deve ser feita manualmente';

      const verified = await NativeBiometric.verifyIdentity({
        title: 'Autenticação',
        maxAttempts: 5,
      })
        .then(() => true)
        .catch(() => false);

      if (!verified) return;

      return credentials;
    } catch (error) {
      return firebaseError(error);
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
        await this.userPrefService.resetBiometricCredentials();
        await this.userPrefService.setBiometricPreferences(false);
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

      await this.userPrefService.setUser(user);

      if (this.isNative) {
        await this.userPrefService.setBiometricCredentials({
          username: email,
          password,
        });
      }

      await this.userPrefService.setLoginType('email');

      return;
    } catch (error) {
      console.log(error);
      return firebaseError(error);
    }
  }

  async googleSignIn() {
    try {
      const signData = await GoogleAuth.signIn();
      const { idToken } = signData.authentication;

      const credential = firebase.auth.GoogleAuthProvider.credential(idToken);

      const { additionalUserInfo, user } = await this.auth.signInWithCredential(
        credential
      );

      if (!user) return 'Erro interno do servidor';

      await this.userPrefService.setLoginType('google');
      await this.userPrefService.setBiometricPreferences(false);

      const { displayName: name, email } = user;

      if (additionalUserInfo?.isNewUser) {
        await this.utils.alertMessage({
          header: 'Bem-vindo!',
          subHeader: `${name ?? 'Novo usuário'}`,
          message: `Vejo que é sua primeira vez por aqui. Enviamos um e-mail para você definir sua senha posteriormente.`,
          buttons: ['OK'],
        });

        if (email) await this.auth.sendPasswordResetEmail(email);
      }

      return;
    } catch (error: any) {
      const message = 'Autenticação com foi Google cancelada';

      if (
        error.error &&
        (error.error === 'popup_closed_by_user' ||
          error.error === 'access_denied')
      )
        return message;

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

      if (this.isNative) await this.userPrefService.resetBiometricCredentials();
      await this.userPrefService.setBiometricPreferences(false);

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
        const credentials =
          await this.userPrefService.getBiometricCredentials();
        if (typeof credentials !== 'string') {
          await this.userPrefService.setBiometricCredentials({
            email: credentials.username,
            password,
          });
        }
      }

      return;
    } catch (error) {
      return firebaseError(error);
    }
  }

  async updateEmail(email: string) {
    try {
      const user = await this.auth.currentUser;
      user?.updateEmail(email);

      if (this.isNative) {
        const credentials =
          await this.userPrefService.getBiometricCredentials();
        if (typeof credentials !== 'string')
          await this.userPrefService.setBiometricCredentials({
            email,
            password: credentials.password,
          });
      }
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

  async refreshToken(user: firebase.User) {
    try {
      await user.getIdTokenResult(true);
      return true;
    } catch (error) {
      return null;
    }
  }
}
