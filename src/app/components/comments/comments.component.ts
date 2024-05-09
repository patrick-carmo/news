import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, inject } from '@angular/core';
import {
  IonContent,
  IonLabel,
  IonItem,
  IonList,
  IonText,
  IonAvatar,
  IonTitle,
  IonInput,
  IonButton,
  IonButtons,
  IonModal,
  IonToolbar,
  IonHeader,
  ModalController,
  IonFooter,
  IonIcon,
} from '@ionic/angular/standalone';
import { Comment, News } from 'src/app/interfaces/interfaces';
import { CommentsService } from 'src/app/services/storage/comments.service';
import { addIcons } from 'ionicons';
import { send } from 'ionicons/icons';
import { UtilsService } from 'src/app/services/utils.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonIcon,
    IonFooter,
    IonHeader,
    IonToolbar,
    IonModal,
    IonButtons,
    IonButton,
    IonInput,
    CommonModule,
    IonTitle,
    IonAvatar,
    IonText,
    IonList,
    IonItem,
    IonLabel,
    IonContent,
  ],
})
export class CommentsComponent implements OnDestroy {
  private modalCtrl = inject(ModalController);
  private auth = inject(AuthService);
  private commentsService = inject(CommentsService);
  private utils = inject(UtilsService);

  private comments$: Subscription | undefined;
  protected comments: Comment[] = [];

  protected comment: string = '';

  @Input() news: News = {} as News;

  constructor() {
    addIcons({
      send,
    });
  }

  ionViewWillEnter() {
    if (!this.comments$)
      this.comments$ = this.commentsService
        .getComments(this.news)
        .subscribe((comments: any) => {
          comments.sort((a: Comment, b: Comment) => {
            return a.date < b.date ? 1 : -1;
          });

          const today = new Date();

          const formattedComments = comments.map((comment: Comment) => {
            if (comment.date instanceof Timestamp) {
              const date = comment.date.toDate();

              const days = Math.floor(
                (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
              );
              const months = Math.floor(days / 30);
              const years = Math.floor(months / 12);

              switch (true) {
                case years > 0:
                  comment.date = `${years} ano(s)`;
                  break;
                case months > 0:
                  comment.date = `${months} mês`;
                  break;
                case days > 0:
                  comment.date = `${days} dia(s)`;
                  break;
                default:
                  comment.date = format(date, 'HH:mm');
              }
            }
            return comment;
          });

          this.comments = formattedComments;
        });
  }

  async addComment(news: News) {
    if (!this.comment)
      return await this.utils.toastMessage({
        message: 'Insira um comentário',
      });

    const user = this.auth.getUser;
    this.commentsService.setComments(news, {
      userId: user?.uid,
      content: this.comment,
      date: new Date(),
    });

    this.comment = '';
  }

  ngOnDestroy() {
    this.comments$?.unsubscribe();
  }

  dimiss() {
    this.modalCtrl.dismiss();
    this.comments$?.unsubscribe();
  }
}
