import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable, inject } from '@angular/core';
import { User } from '../../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private firestore = inject(AngularFirestore);

  constructor() {}
}
