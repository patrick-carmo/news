import { Component, OnDestroy } from '@angular/core';
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
  items: News[] = [];
  user: User | null = null;
  searchItems: News[] = [];
  inSearch: boolean = false;
  query: string = '';

  bookmarks$: Subscription | undefined;

  constructor(private storage: StorageService, private auth: AuthService) {
    this.user = this.auth.getUser;

    if (this.user)
      this.bookmarks$ = this.storage
        .getObsDocs(`${this.user.email}-bookmarks`)
        .subscribe((news: any) => {
          this.items = news;
        });
  }

  ngOnDestroy() {
    this.bookmarks$?.unsubscribe();
  }

  searchNews() {
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
