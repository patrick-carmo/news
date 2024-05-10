import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { forkJoin, map, switchMap } from 'rxjs';
import { News } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private firestore = inject(AngularFirestore);

  constructor() {}

  getComments(data: News) {
    const posts$ = this.firestore
      .collection('posts')
      .doc(data.id.toString())
      .collection('comments')
      .snapshotChanges();

    return posts$.pipe(
      switchMap((posts) => {
        const userObservables = posts.map((commentDoc) => {
          const userId = commentDoc.payload.doc.data()['userId'];
          return this.firestore.collection('users').doc(userId).get();
        });

        return forkJoin(userObservables).pipe(
          map((usersDocs) => {
            const commentsData = posts.map((commentDoc, index) => {
              const user = usersDocs[index].data();
              const content = commentDoc.payload.doc.data();
              const data = Object.assign({}, content, user);
              return data;
            });
            return commentsData;
          })
        );
      })
    );
  }

  setComments(
    news: News,
    comment: {
      userId: string;
      content: string;
      date: Date;
    }
  ) {
    const id = this.firestore.createId();

    return this.firestore
      .collection('posts')
      .doc(news.id.toString())
      .collection('comments')
      .doc(id)
      .set({ id, ...comment });
  }

  updateComment(
    news: News,
    comment: {
      id: string;
      userId: string;
      content: string;
      date: Date;
    }
  ) {
    return this.firestore
      .collection('posts')
      .doc(news.id.toString())
      .collection('comments')
      .doc(comment.id)
      .update(comment);
  }

  delComment(news: News, comment: any) {
    return this.firestore
      .collection('posts')
      .doc(news.id.toString())
      .collection('comments')
      .doc(comment.id)
      .delete();
  }
}
