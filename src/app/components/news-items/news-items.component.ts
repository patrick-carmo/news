import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, inject } from '@angular/core';
import {
  IonItem,
  IonCard,
  IonImg,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonCardHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonFabList,
  IonSearchbar,
  IonButtons,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add,
  bookmarkOutline,
  bookmarkSharp,
  chevronDownCircleOutline,
  document,
  shareSocialSharp,
  thumbsUp,
  thumbsUpOutline,
} from 'ionicons/icons';
import { News } from 'src/app/interfaces/interfaces';
import { NewsService } from 'src/app/services/news/news.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CommentsComponent } from '../comments/comments.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { firstValueFrom } from 'rxjs';
import { LikesService } from 'src/app/services/storage/news/likes.service';
import { LikesComponent } from '../likes/likes.component';

@Component({
  selector: 'app-news-items',
  templateUrl: './news-items.component.html',
  styleUrls: ['./news-items.component.scss', '../../app.component.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonSearchbar,
    CommonModule,
    IonItem,
    IonCard,
    IonImg,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonFab,
    IonFabButton,
    IonIcon,
    IonFabList,
  ],
})
export class NewsItemsComponent {
  protected news = inject(NewsService);
  private utils = inject(UtilsService);
  private auth = inject(AuthService);
  private likeService = inject(LikesService);
  private modalCtrl = inject(ModalController);

  @Input() items: News[] = [];
  @Input() isBookmarksPage = false;

  protected search: News[] = [];
  constructor() {
    addIcons({
      shareSocialSharp,
      add,
      document,
      chevronDownCircleOutline,
      bookmarkOutline,
      bookmarkSharp,
      thumbsUpOutline,
      thumbsUp,
    });
  }

  protected async openComments(news: News) {
    const modal = await this.modalCtrl.create({
      component: CommentsComponent,
      breakpoints: [0, 0.4, 1],
      initialBreakpoint: 1,
      componentProps: {
        news,
      },
    });
    await modal.present();
  }

  protected async toggleLike(news: News) {
    try {
      const user = this.auth.getUser;

      if (!user)
        return await this.utils.toastMessage({
          message: 'Você precisa estar logado para curtir o post',
          color: 'warning',
        });

      const like = await firstValueFrom(this.likeService.getLike(news, user));

      const likes = (await firstValueFrom(this.likeService.getLikes(news)))
        .length;

      if (like.exists) {
        this.likeService.removeLike(news, user);
        this.likeService.removeUserLike(news, user);
        news.liked = false;
        news.likes = likes - 1;
        return;
      }

      await this.likeService.setLike(news, user);
      await this.likeService.setUserLike(news, user);
      news.liked = true;
      news.likes = likes + 1;
    } catch {
      this.utils
        .toastMessage({
          message: 'Erro ao curtir',
          color: 'danger',
        })
        .catch(() => console.error('Error'));
    }
  }

  protected async toogleBookmark(item: any) {
    try {
      const result = await this.news.toggleBookmarksStorage(item);

      if (result) {
        await this.utils.toastMessage({
          message: 'Notícia salva',
          color: 'success',
          buttons: [
            {
              text: 'Desfazer',
              role: 'cancel',
              handler: () => {
                return this.toogleBookmark(item);
              },
            },
          ],
        });

        return;
      }

      await this.utils.toastMessage({
        message: 'Notícia removida',
        buttons: [
          {
            text: 'Desfazer',
            role: 'cancel',
            handler: () => {
              return this.toogleBookmark(item);
            },
          },
        ],
        color: 'warning',
      });
    } catch (error: any) {
      this.utils
        .toastMessage({
          message: 'Erro ao alterar favoritos',
          color: 'danger',
        })
        .catch(() => console.error('Error'));
    }
  }

  protected async showLikes(news: News) {
    const modal = await this.modalCtrl.create({
      component: LikesComponent,
      breakpoints: [0, 0.4, 1],
      initialBreakpoint: 0.8,
      componentProps: {
        news,
      },
    });
    await modal.present();
  }

  protected getItemIcon(item: any) {
    return item.saved ? 'bookmark-sharp' : 'bookmark-outline';
  }
}
