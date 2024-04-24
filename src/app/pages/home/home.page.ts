import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
export class HomePage implements OnInit {
  user: any;
  savedNews: any = [];
  items: any = [];
  private page: number = 1;
  private readonly qtyItems: number = 15;

  inSearch: boolean = false;

  query: string = '';
  searchItems: any = [];
  private searchPage: number = 1;

  bookmarks: any;

  constructor(
    private news: NewsService,
    private utils: UtilsService,
    private auth: AuthService,
    private storage: StorageService
  ) {}

  async ngOnInit() {
    this.user = this.auth.getUser;

    if (this.user) {
      const bookmarks = await this.storage.getDocs(
        `${this.user?.email}-bookmarks`
      );

      bookmarks?.docs.forEach((doc: any) => {
        this.savedNews.push(doc.data());
      });

      this.generateItems();
    }
  }

  private formatItems(data: any) {
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
        saved: this.savedNews?.some((doc: any) => doc.id === item.id) ?? false,
      };
    });
  }

  private generateItems(page: number = 1, arrayMethod: string = 'push') {
    this.news.getNews(this.qtyItems, page).subscribe(
      (data: any) => {
        const items = this.formatItems(data);

        const filteredItems = items.filter(
          (newItem: any) =>
            !this.items.some((item: any) => item.link === newItem.link)
        );

        if (filteredItems.length > 0) {
          this.items[arrayMethod](...filteredItems);
          this.page++;
        }
      },
      () => {
        this.utils.toastMessage({
          message: 'Erro ao carregar notícias',
          color: 'danger',
        });
      }
    );
  }

  search(arrayMethod: string = 'unshift') {
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

        const filteredItems = items.filter(
          (newItem: any) =>
            !this.searchItems.some((item: any) => item.link === newItem.link)
        );

        if (filteredItems.length > 0) {
          this.searchItems[arrayMethod](...filteredItems);
          this.searchPage++;
          return;
        }

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

  onIonInfinite(ev: any, search: boolean = false) {
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

  handleRefresh(event: any, search: boolean = false) {
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
