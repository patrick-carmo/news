import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
import { NewsService } from 'src/app/services/news.service';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FormsModule } from '@angular/forms';
import { NewsItemsComponent } from 'src/app/components/news-items/news-items.component';
import { UtilsService } from 'src/app/services/utils.service';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { News, User } from 'src/app/interfaces/interfaces';

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
export class HomePage implements OnInit, OnDestroy {
  private news = inject(NewsService);
  private utils = inject(UtilsService);
  private auth = inject(AuthService);
  private storage = inject(StorageService);

  protected user: User | null = null;
  protected bookmarks$: Subscription | undefined;
  protected bookmarks: News[] = [];
  protected items: News[] = [];
  private page: number = 1;
  private readonly qtyItems: number = 15;

  protected inSearch: boolean = false;

  protected query: string = '';
  protected searchItems: News[] = [];
  private searchPage: number = 1;

  constructor() {
    this.user = this.auth.getUser;
  }

  async ngOnInit() {
    if (this.user && !this.bookmarks$)
      this.bookmarks$ = this.storage
        .getObsDocs(`${this.user.email}-bookmarks`)
        .subscribe((news: any) => {
          this.bookmarks = news;
          if (this.items.length === 0) this.generateItems();

          this.items.forEach((item: News) => {
            item.saved = this.bookmarks.some((doc: any) => doc.id === item.id);
          });
        });
  }

  ngOnDestroy() {
    this.bookmarks$?.unsubscribe();
  }

  private formatItems(data: any): News[] {
    return data.items.map((item: any) => {
      const images = JSON.parse(item.imagens);
      const imageLink = `https://agenciadenoticias.ibge.gov.br/${images.image_intro}`;
      return {
        id: item.id,
        title: item.titulo,
        intro: item.introducao,
        date: item.data_publicacao ? item.data_publicacao.substring(0, 10) : '',
        image: imageLink,
        link: item.link,
        saved: this.bookmarks.some((doc: any) => doc.id === item.id),
      };
    });
  }

  private generateItems(
    page: number = 1,
    arrayMethod: 'push' | 'unshift' = 'push'
  ) {
    this.news.getNews(this.qtyItems, page).subscribe(
      (data: any) => {
        const items = this.formatItems(data);
        this.items[arrayMethod](...items);
        this.page++;
      },
      () => {
        this.utils.toastMessage({
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
      return;
    }

    this.inSearch = true;

    this.news.searchNews(this.qtyItems, this.searchPage, query).subscribe(
      (data: any) => {
        const items = this.formatItems(data);
        this.searchItems[arrayMethod](...items);
        this.searchPage++;

        if (items.length === 0)
          this.utils.toastMessage({
            message: 'Nenhuma notícia encontrada',
            color: 'warning',
          });
      },
      () =>
        this.utils.toastMessage({
          message: 'Erro ao buscar notícias',
          color: 'danger',
        })
    );
  }

  protected onIonInfinite(ev: any, search: boolean = false) {
    if (search) {
      this.search('push');
    } else {
      this.generateItems(this.page);
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
