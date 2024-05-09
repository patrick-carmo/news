import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Preferences } from '@capacitor/preferences';
import { NativeBiometric } from 'capacitor-native-biometric';
import { User } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserPreferencesService {
  private firestore = inject(AngularFirestore);

  private server = import.meta.env['NG_APP_SERVER'];

  constructor() {}

  getUser(uid: string) {
    return this.firestore.collection('users').doc(uid).valueChanges();
  }

  setUser(user: User) {
    const { email, displayName, photoURL, uid } = user;

    return this.firestore.collection('users').doc(uid).set({
      email,
      displayName,
      photoURL,
    });
  }

  async getStorage(key: string) {
    const { value } = await Preferences.get({ key });
    return value ? JSON.parse(value) : null;
  }

  async setStorage(key: string, value: any) {
    await Preferences.set({ key, value: JSON.stringify(value) });
  }

  async setBiometricPreferences(value: boolean) {
    await this.setStorage('biometry', value);
  }

  async setLoginType(value: string) {
    await this.setStorage('loginType', value);
  }

  async getLoginType() {
    return await this.getStorage('loginType');
  }

  async setBiometricCredentials(credentials: any) {
    const { username, password } = credentials;
    await NativeBiometric.setCredentials({
      username,
      password,
      server: this.server,
    });
  }

  async getBiometricCredentials() {
    try {
      const credentials = NativeBiometric.getCredentials({
        server: this.server,
      });

      return credentials;
    } catch {
      return 'Credenciais não encontradas, faça login manualmente.';
    }
  }

  async resetBiometricCredentials() {
    await NativeBiometric.deleteCredentials({
      server: this.server,
    });
  }

  async getBiometricPreferences() {
    return await this.getStorage('biometry');
  }
}
