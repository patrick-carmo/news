import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
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
  thumbsUpOutline,
} from 'ionicons/icons';
import { News } from 'src/app/interfaces/interfaces';
import { NewsService } from 'src/app/services/news.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CommentsComponent } from '../comments/comments.component';

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
    });
  }

  protected async openComments() {
    const modal = await this.modalCtrl.create({
      component: CommentsComponent,
      breakpoints: [0, 0.4, 1],
      initialBreakpoint: 0.8,
    });
    await modal.present();
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

  protected getItemIcon(item: any) {
    return item.saved ? 'bookmark-sharp' : 'bookmark-outline';
  }
}
