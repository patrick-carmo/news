import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonSearchbar,
} from '@ionic/angular/standalone';
import { NewsItemsComponent } from 'src/app/components/news-items/news-items.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { News, User } from 'src/app/interfaces/interfaces';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss', '../../app.component.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonList,
    HeaderComponent,
    NewsItemsComponent,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonSearchbar,
  ],
})
export class BookmarksPage implements OnDestroy {
  private auth = inject(AuthService);
  private news = inject(NewsService);

  protected items: News[] = [];
  private user: User | null = null;
  protected searchItems: News[] = [];
  protected inSearch: boolean = false;
  protected query: string = '';

  protected bookmarks$: Subscription | undefined;

  constructor() {
    this.user = this.auth.getUser;

    if (this.user)
      this.bookmarks$ = this.news.getObsBookmarks().subscribe((news) => {
        this.items = news;
      });
  }

  ngOnDestroy() {
    this.bookmarks$?.unsubscribe();
  }

  protected searchNews() {
    const query = this.query.toLowerCase().trim();
    if (!query) {
      this.inSearch = false;
      this.searchItems = [];
      return;
    }

    this.inSearch = true;

    const result = this.items.filter((item: any) => {
      return item.title.toLowerCase().includes(this.query.toLowerCase());
    });

    this.searchItems = result;
  }
}
