import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { News, User } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  private firestore = inject(AngularFirestore);
  constructor() {}

  getUserLikes(user: User) {
    return this.firestore
      .collection('users')
      .doc(user.uid)
      .collection('likes')
      .valueChanges();
  }

  setUserLike(news: News, user: User) {
    return this.firestore
      .collection('users')
      .doc(user.uid)
      .collection('likes')
      .doc(news.id.toString())
      .set({
        newsId: news.id,
        date: new Date(),
      });
  }

  removeUserLike(news: News, user: User) {
    return this.firestore
      .collection('users')
      .doc(user.uid)
      .collection('likes')
      .doc(news.id.toString())
      .delete();
  }

  getLikes(news: News) {
    return this.firestore
      .collection('posts')
      .doc(news.id.toString())
      .collection('likes')
      .valueChanges();
  }

  getLike(news: News, user: User) {
    return this.firestore
      .collection('posts')
      .doc(news.id.toString())
      .collection('likes')
      .doc(user.uid)
      .get();
  }

  setLike(news: News, user: User) {
    return this.firestore
      .collection('posts')
      .doc(news.id.toString())
      .collection('likes')
      .doc(user.uid)
      .set({
        userId: user.uid,
        date: new Date(),
      });
  }

  removeLike(news: News, user: User) {
    return this.firestore
      .collection('posts')
      .doc(news.id.toString())
      .collection('likes')
      .doc(user.uid)
      .delete();
  }
}
