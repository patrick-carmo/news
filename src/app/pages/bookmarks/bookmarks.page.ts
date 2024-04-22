import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
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
    HeaderComponent,
    NewsItemsComponent,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class BookmarksPage {
  news: any = [];
  constructor(private storage: StorageService, private auth: AuthService) {}

  async ionViewWillEnter() {
    const user: any = await this.auth.getUser();
    this.news = [];
    const items = await this.storage.getDocs(`${user?.email}-bookmarks`);
    items?.docs.forEach((doc: any) => {
      this.news.push(doc.data());
    });
  }

  
  removeBookmark(item: any) {
    const index = this.news.indexOf(item);
    if (index !== -1) {
      this.news.splice(index, 1);
    }
  }
}
