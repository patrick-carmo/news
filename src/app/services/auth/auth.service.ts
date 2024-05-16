import { UserPreferencesService } from './../storage/user-preferences.service';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { NativeBiometric } from 'capacitor-native-biometric';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import firebase from 'firebase/compat/app';
import { Subscription } from 'rxjs';
import { UtilsService } from '../utils.service';
import { CustomError } from 'src/app/utils/error/custom-error';

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

  ngOnDestroy() {
    this.userState$?.unsubscribe();
  }

  get authState() {
    return this.auth.authState;
  }

  get getUser() {
    return this.user;
  }

  async performBiometricVerification() {
    const result = await NativeBiometric.isAvailable();

    if (!result.isAvailable) throw new CustomError('Biometria indisponível');

    const credentials = await this.userPrefService.getBiometricCredentials();
    if (typeof credentials === 'string') return credentials;

    const { username, password } = credentials;

    if (!username || !password)
      throw new CustomError(
        'A primeira autenticação deve ser feita manualmente'
      );

    const verified = await NativeBiometric.verifyIdentity({
      title: 'Autenticação',
      maxAttempts: 5,
    })
      .then(() => true)
      .catch(() => false);

    if (!verified) return;

    return credentials;
  }

  async createUser(email: string, password: string) {
    const { user } = await this.auth.createUserWithEmailAndPassword(
      email,
      password
    );

    if (!user) throw new Error('Erro interno do servidor');

    user.sendEmailVerification();

    if (this.isNative) {
      await this.userPrefService.resetBiometricCredentials();
      await this.userPrefService.setBiometricPreferences(false);
    }

    return;
  }

  async emailSignIn(email: string, password: string) {
    const { user } = await this.auth.signInWithEmailAndPassword(
      email,
      password
    );

    if (!user?.emailVerified) {
      user?.sendEmailVerification();
      throw new CustomError('Verifique seu e-mail para autenticar.');
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
  }

  async googleSignIn() {
    const signData = await GoogleAuth.signIn();
    const { idToken } = signData.authentication;

    const credential = firebase.auth.GoogleAuthProvider.credential(idToken);

    const { additionalUserInfo, user } = await this.auth.signInWithCredential(
      credential
    );

    if (!user) throw new Error('Erro interno do servidor');

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

    await this.userPrefService.setUser(user);

    return;
  }

  async signOut() {
    await this.auth.signOut();
    await this.router.navigate(['/login']);
  }

  async resetPassword(email: string) {
    await this.auth.sendPasswordResetEmail(email);

    if (this.isNative) await this.userPrefService.resetBiometricCredentials();
    await this.userPrefService.setBiometricPreferences(false);
  }

  async updatePassword(password: string) {
    const user = await this.auth.currentUser;

    if (user) await user.updatePassword(password);

    if (this.isNative) {
      const credentials = await this.userPrefService.getBiometricCredentials();
      await this.userPrefService.setBiometricCredentials({
        email: credentials.username,
        password,
      });
    }
  }

  async updateEmail(email: string) {
    const user = await this.auth.currentUser;
    user?.updateEmail(email);

    if (this.isNative) {
      const credentials = await this.userPrefService.getBiometricCredentials();
      if (typeof credentials !== 'string')
        await this.userPrefService.setBiometricCredentials({
          email,
          password: credentials.password,
        });
    }
  }

  async updateProfile(displayName: string, photoURL: string) {
    await this.auth.currentUser.then((user) => {
      user?.updateProfile({ displayName, photoURL });
    });
  }
}
