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
  bookmarkOutline,
  bookmarkSharp,
  chevronDownCircleOutline,
  document,
  globe,
  shareSocialSharp,
} from 'ionicons/icons';
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
  @Input() items: any;
  @Input() isBookmarksPage = false;
  search: any;
  constructor(public news: NewsService, private utils: UtilsService) {
    addIcons({
      shareSocialSharp,
      document,
      globe,
      chevronDownCircleOutline,
      bookmarkOutline,
      bookmarkSharp,
    });
  }

  async toogleBookmark(item: any, index?: number) {
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

      if (index === undefined) {
        if (this.isBookmarksPage) this.items.unshift(item);
        return result;
      }

      if (this.items[index]) {
        this.items[index].saved = result;
      }

      if (this.isBookmarksPage) {
        this.items.splice(index, 1);
      }

      return result;
    } catch (error: any) {
      return this.utils.toastMessage({
        message: 'Erro ao alterar favoritos',
        color: 'danger',
      });
    }
  }

  getItemIcon(item: any) {
    return item.saved ? 'bookmark-sharp' : 'bookmark-outline';
  }
}
