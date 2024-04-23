import { Component } from '@angular/core';
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

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
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
export class BookmarksPage {
  items: any = [];
  user: any;
  searchItems: any;
  inSearch: boolean = false;
  query: string = '';

  constructor(private storage: StorageService, private auth: AuthService) {}

  async ionViewWillEnter() {
    if (!this.user) {
      this.user = await this.auth.getUser();
    }
    this.items = [];
    const news = await this.storage.getDocs(`${this.user?.email}-bookmarks`);
    news?.docs.forEach((doc: any) => {
      this.items.push(doc.data());
    });
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
