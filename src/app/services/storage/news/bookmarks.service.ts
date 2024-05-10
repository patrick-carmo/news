import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { News, User } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class BookmarksService {
  private firestore = inject(AngularFirestore);

  constructor() {}

  getBookmarks(user: User) {
    return this.firestore
      .collection('users')
      .doc(user.uid)
      .collection('bookmarks')
      .valueChanges();
  }

  getBookmark(user: User, data: News) {
    return this.firestore
      .collection('users')
      .doc(user.uid)
      .collection('bookmarks')
      .doc(data.id.toString())
      .get();
  }

  setBookmark(user: User, data: News) {
    return this.firestore
      .collection('users')
      .doc(user.uid)
      .collection('bookmarks')
      .doc(data.id.toString())
      .set(data);
  }

  delBookmark(user: User, data: News) {
    return this.firestore
      .collection('users')
      .doc(user.uid)
      .collection('bookmarks')
      .doc(data.id.toString())
      .delete();
  }
}
