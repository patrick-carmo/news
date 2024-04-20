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

  getStorage(key: string) {
    return Preferences.get({ key });
  }

  setStorage(key: string, value: any) {
    Preferences.set({ key, value });
  }

  setBiometricPreferences(value: boolean) {
    this.setStorage('biometric', value);
  }

  async getBiometricPreferences() {
    const data = (await this.getStorage('biometric')).value;
    const result: boolean = data ? JSON.parse(data) : false;

    return result;
  }
}
