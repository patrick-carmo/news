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
  IonCol,
  IonGrid,
  IonRow,
} from '@ionic/angular/standalone';
import { Comment, FormattedComment, News } from 'src/app/interfaces/interfaces';
import { CommentsService } from 'src/app/services/storage/news/comments.service';
import { addIcons } from 'ionicons';
import { createOutline, send, trashOutline } from 'ionicons/icons';
import { UtilsService } from 'src/app/services/utils.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Timestamp } from 'firebase/firestore';
import { formatDate } from 'src/app/utils/formatDate';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  standalone: true,
  imports: [
    IonRow,
    IonGrid,
    IonCol,
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
  protected formattedComments: FormattedComment[] = [];

  protected comment: string = '';

  protected userId: string = '';

  @Input() news: News = {} as News;

  constructor() {
    addIcons({
      send,
      trashOutline,
      createOutline,
    });
  }

  ionViewWillEnter() {
    this.userId = this.auth.getUser?.uid || '';

    if (!this.comments$) {
      this.comments$ = this.commentsService
        .getComments(this.news)
        .subscribe((comments: any) => {
          comments.sort((a: Comment, b: Comment) => {
            return a.date < b.date ? 1 : -1;
          });

          this.comments = comments;

          const formattedComments = comments.map(
            (comment: FormattedComment) => {
              if (comment.date instanceof Timestamp) {
                comment.formattedDate = formatDate(comment.date.toDate());
              }
              return comment;
            }
          );
          this.formattedComments = formattedComments;
        });
    }
  }

  async addComment(news: News) {
    if (!this.comment)
      return await this.utils.toastMessage({
        message: 'Insira um comentário',
        color: 'warning',
      });

    const user = this.auth.getUser;
    this.commentsService.setComments(news, {
      userId: user!.uid,
      content: this.comment,
      date: new Date(),
    });

    this.comment = '';
  }

  updateComment(comment: Comment) {
    this.utils.alertMessage({
      message: 'Editar comentário',
      inputs: [
        {
          name: 'comment',
          type: 'text',
          value: comment.content,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Salvar',
          handler: async (data) => {
            if (data.comment === comment.content) return;

            if (!data.comment)
              return await this.utils.toastMessage({
                message: 'Comentário não pode ser vazio',
                color: 'warning',
              });

            comment.content = data.comment;

            await this.commentsService.updateComment(this.news, {
              id: comment.id,
              userId: comment.userId,
              content: comment.content,
              date: new Date(),
            });

            await this.utils.toastMessage({
              message: 'Comentário editado',
              color: 'success',
            });
          },
        },
      ],
    });
  }

  async delComment(comment: Comment, del: boolean = false) {
    try {
      if (!del)
        return await this.utils.alertMessage({
          message: 'Deseja excluir o comentário?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
            },
            {
              text: 'Excluir',
              handler: async () => {
                await this.delComment(comment, true);
              },
            },
          ],
        });

      if (this.comments.length === 1) this.comments = [];

      await this.commentsService.delComment(this.news, comment);

      await this.utils.toastMessage({
        message: 'Comentário excluído',
        color: 'warning',
        buttons: [
          {
            text: 'Desfazer',
            role: 'cancel',
            handler: async () => {
              await this.commentsService.setComments(this.news, {
                userId: comment.userId,
                content: comment.content,
                date: new Date(),
              });

              await this.utils.toastMessage({
                message: 'Comentário restaurado',
                color: 'success',
              });
            },
          },
        ],
      });
    } catch {
      this.utils
        .toastMessage({
          message: 'Erro ao excluir comentário',
          color: 'danger',
        })
        .catch(() => console.error('Error'));
    }
  }

  ngOnDestroy() {
    this.comments$?.unsubscribe();
  }

  dimiss() {
    this.modalCtrl.dismiss();
    this.ngOnDestroy();
  }
}
