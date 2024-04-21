import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  hasBiometric: boolean = false;
  constructor(private firestore: AngularFirestore) {}

  getDoc(collection: string, doc: string) {
    return this.firestore.collection(collection).doc(doc).get();
  }

  setDoc(collection: string, doc: string, data: any) {
    return this.firestore.collection(collection).doc(doc).set(data);
  }

  async getStorage(key: string) {
    const { value } = await Preferences.get({ key });
    return value;
  }

  async setStorage(key: string, value: any) {
    await Preferences.set({ key, value });
  }

  async setBiometricPreferences(value: boolean) {
    await this.setStorage('biometry', JSON.stringify(value));
  }

  async getBiometricPreferences() {
    const data = await this.getStorage('biometry');
    return data ? JSON.parse(data) : false;
  }
}
