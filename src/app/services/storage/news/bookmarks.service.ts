import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { News, User } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class BookmarksService {
  private firestore = inject(AngularFirestore);

  constructor() {}

  userBookmarks(user: User) {
    return this.firestore
      .collection('users')
      .doc(user.uid)
      .collection('bookmarks');
  }

  userBookmark(user: User, data: News) {
    return this.firestore
      .collection('users')
      .doc(user.uid)
      .collection('bookmarks')
      .doc(data.id.toString());
  }

  getBookmarks(user: User) {
    return this.userBookmarks(user).valueChanges();
  }

  getBookmark(user: User, data: News) {
    return this.userBookmark(user, data).get();
  }

  setBookmark(user: User, data: News) {
    return this.userBookmark(user, data).set(data);
  }

  delBookmark(user: User, data: News) {
    return this.userBookmark(user, data).delete();
  }
}
