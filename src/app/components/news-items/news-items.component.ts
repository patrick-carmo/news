import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add,
  bookmarkOutline,
  bookmarkSharp,
  chevronDownCircleOutline,
  document,
  shareSocialSharp,
} from 'ionicons/icons';
import { News } from 'src/app/interfaces/interfaces';
import { NewsService } from 'src/app/services/news.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-news-items',
  templateUrl: './news-items.component.html',
  styleUrls: ['./news-items.component.scss', '../../app.component.scss'],
  standalone: true,
  imports: [
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
  @Input() items: News[] = [];
  @Input() isBookmarksPage = false;

  protected search: News[] = [];
  constructor(public news: NewsService, private utils: UtilsService) {
    addIcons({
      shareSocialSharp,
      add,
      document,
      chevronDownCircleOutline,
      bookmarkOutline,
      bookmarkSharp,
    });
  }

  protected async toogleBookmark(item: any) {
    try {
      const result = await this.news.toggleBookmarksStorage(item);

      if (result)
        await this.utils.toastMessage({
          message: 'Notícia salva',
          color: 'success',
        });
      else
        await this.utils.toastMessage({
          message: 'Notícia removida',
          buttons: [
            {
              text: 'Desfazer',
              role: 'cancel',
              handler: async () => {
                return await this.toogleBookmark(item);
              },
            },
          ],
          color: 'warning',
        });
    } catch (error: any) {
      return this.utils.toastMessage({
        message: 'Erro ao alterar favoritos',
        color: 'danger',
      });
    }
  }

  protected getItemIcon(item: any) {
    return item.saved ? 'bookmark-sharp' : 'bookmark-outline';
  }
}
