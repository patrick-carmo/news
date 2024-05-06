import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable, inject } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { NativeBiometric } from 'capacitor-native-biometric';
import { News, User } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private firestore = inject(AngularFirestore);
  private server = import.meta.env['NG_APP_SERVER'];

  constructor() {}

  getBookmarks(user: User) {
    return this.firestore
      .collection('users')
      .doc(user.email as string)
      .collection('bookmarks')
      .valueChanges();
  }

  getBookmark(user: User, data: News) {
    return this.firestore
      .collection('users')
      .doc(user.email as string)
      .collection('bookmarks')
      .doc(data.id.toString())
      .get()
  }

  setBookmark(user: User, data: News) {
    return this.firestore
      .collection('users')
      .doc(user.email as string)
      .collection('bookmarks')
      .doc(data.id.toString())
      .set(data);
  }

  delBookmark(user: User, data: News) {
    return this.firestore
      .collection('users')
      .doc(user.email as string)
      .collection('bookmarks')
      .doc(data.id.toString())
      .delete();
  }

  getComments(data: News) {
    return this.firestore
      .collection('posts')
      .doc(data.id.toString())
      .collection('comments')
      .valueChanges();
  }

  setComments(data: News, comment: any) {
    return this.firestore
      .collection('posts')
      .doc(data.id.toString())
      .collection('comments')
      .add(comment);
  }

  delComments(data: News, comment: any) {
    return this.firestore
      .collection('posts')
      .doc(data.id.toString())
      .collection('comments')
      .doc(comment.id)
      .delete();
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
