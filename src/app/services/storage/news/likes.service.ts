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

  usersLike(news: News, user: User) {
    return this.firestore
      .collection('users')
      .doc(user.uid)
      .collection('likes')
      .doc(news.id.toString());
  }

  setUserLike(news: News, user: User) {
    return this.usersLike(news, user).set({
      newsId: news.id,
      date: new Date(),
    });
  }

  removeUserLike(news: News, user: User) {
    return this.usersLike(news, user).delete();
  }

  getLikes(news: News) {
    return this.firestore
      .collection('posts')
      .doc(news.id.toString())
      .collection('likes')
      .valueChanges();
  }

  postsLikes(news: News, user: User) {
    return this.firestore
      .collection('posts')
      .doc(news.id.toString())
      .collection('likes')
      .doc(user.uid);
  }

  getLike(news: News, user: User) {
    return this.postsLikes(news, user).get();
  }

  setLike(news: News, user: User) {
    return this.postsLikes(news, user).set({
      userId: user.uid,
      date: new Date(),
    });
  }

  removeLike(news: News, user: User) {
    return this.postsLikes(news, user).delete();
  }
}
