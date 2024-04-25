import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { NativeBiometric } from 'capacitor-native-biometric';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private server = import.meta.env['NG_APP_SERVER'];

  constructor(private firestore: AngularFirestore) {}

  getDocs(collection: string) {
    return this.firestore
      .collection(collection)
      .get()
      .pipe(take(1))
      .toPromise();
  }

  getObsDocs(collection: string) {
    return this.firestore.collection(collection).valueChanges();
  }

  getDoc(collection: string, doc: string | number) {
    return this.firestore
      .collection(collection)
      .doc(doc.toString())
      .get()
      .pipe(take(1))
      .toPromise();
  }

  setDoc(collection: string, doc: string | number, data: any) {
    return this.firestore.collection(collection).doc(doc.toString()).set(data);
  }

  delDoc(collection: string, doc: string | number) {
    return this.firestore.collection(collection).doc(doc.toString()).delete();
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
