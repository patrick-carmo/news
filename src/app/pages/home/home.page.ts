import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import {
  InfiniteScrollCustomEvent,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInfiniteScrollContent,
  IonItem,
  IonList,
  IonMenuButton,
  IonRow,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  IonInfiniteScroll,
  IonRefresher,
  IonRefresherContent,
  IonInput,
} from '@ionic/angular/standalone';
import { NewsService } from 'src/app/services/news/news.service';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FormsModule } from '@angular/forms';
import { NewsItemsComponent } from 'src/app/components/news-items/news-items.component';
import { UtilsService } from 'src/app/services/utils.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { News, User } from 'src/app/interfaces/interfaces';
import { LikesService } from 'src/app/services/storage/news/likes.service';
import { DocumentData } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss', '../../app.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    NewsItemsComponent,
    IonInput,
    IonRefresher,
    CommonModule,
    FormsModule,
    IonInfiniteScroll,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonContent,
    IonList,
    IonItem,
    IonSearchbar,
    IonCard,
    IonImg,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonFab,
    IonFabButton,
    IonFabList,
    IonIcon,
    IonInfiniteScrollContent,
    IonRefresher,
    IonRefresherContent,
  ],
})
export class HomePage implements OnDestroy {
  private news = inject(NewsService);
  private utils = inject(UtilsService);
  private auth = inject(AuthService);
  private likeService = inject(LikesService);

  private user$: Subscription | undefined;
  private user: User | undefined | null;
  private bookmarks$: Subscription | undefined;
  private bookmarks: News[] = [];
  protected items: News[] = [];

  private userLikes$: Subscription | undefined;
  private userLikes: DocumentData[] = [];

  private page: number = 1;
  private readonly qtyItems: number = 15;

  protected inSearch: boolean = false;

  protected query: string = '';
  protected searchItems: News[] = [];
  private searchPage: number = 1;

  constructor() {
    this.user$ = this.auth.authState.subscribe((user) => {
      this.user = user;
      if (!user) return;

      if (!this.userLikes$)
        this.userLikes$ = this.likeService
          .getUserLikes(user)
          .subscribe((likes) => {
            if (!this.user) return;

            this.userLikes = likes;

            this.items.forEach((item: News) => {
              item.liked = likes.some((doc: any) => {
                return doc.newsId === item.id;
              });
            });
          });

      if (!this.bookmarks$)
        this.bookmarks$ = this.news
          .getObsBookmarks()
          .subscribe(async (news: any) => {
            if (!this.user) return;

            this.bookmarks = news;

            if (this.items.length === 0) await this.generateItems();

            this.items.forEach((item: News) => {
              item.saved = this.bookmarks.some(
                (doc: any) => doc.id === item.id
              );
            });
          });
    });
  }

  ngOnDestroy() {
    this.bookmarks$?.unsubscribe();
    this.user$?.unsubscribe();
    this.userLikes$?.unsubscribe();
  }

  private async generateItems(
    page: number = 1,
    arrayMethod: 'push' | 'unshift' = 'push'
  ) {
    this.news.getNews(this.qtyItems, page).subscribe(
      async (data) => {
        const news = data as unknown as News[];
        const items = await this.news.formatNews(news, this.bookmarks);

        this.items[arrayMethod](...items);

        this.page++;
      },
      async () => {
        await this.utils.toastMessage({
          message: 'Erro ao carregar notícias',
          color: 'danger',
        });
      }
    );
  }

  protected search(arrayMethod: 'push' | 'unshift' = 'unshift') {
    const query = this.query.toLowerCase().trim();
    if (!query) {
      this.inSearch = false;
      this.searchItems = [];
      this.searchPage = 1;
      return;
    }

    this.inSearch = true;

    this.news.searchNews(this.qtyItems, this.searchPage, query).subscribe(
      async (data: any) => {
        const items = await this.news.formatNews(data, this.bookmarks);
        this.searchItems[arrayMethod](...items);

        if (!items.length)
          await this.utils.toastMessage({
            message: 'Nenhuma notícia encontrada',
          });
      },
      async () =>
        await this.utils.toastMessage({
          message: 'Erro ao buscar notícias',
          color: 'danger',
        })
    );
  }

  protected async onIonInfinite(ev: any, inSearch: boolean = false) {
    if (inSearch) {
      this.searchPage++;
      this.search('push');
    } else {
      await this.generateItems(this.page);
    }

    setTimeout(() => {
      (
        (ev as InfiniteScrollCustomEvent).target as HTMLIonInfiniteScrollElement
      ).complete();
    }, 3000);
  }

  protected handleRefresh(event: any, search: boolean = false) {
    setTimeout(() => {
      if (search) {
        this.searchItems = [];
        this.searchPage = 1;
        this.search();
      } else {
        this.items = [];
        this.page = 1;
        this.generateItems(1, 'unshift');
      }
      event.target.complete();
    }, 1000);
  }
}
