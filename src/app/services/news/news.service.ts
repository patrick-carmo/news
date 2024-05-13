import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { UtilsService } from '../utils.service';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';
import { Browser } from '@capacitor/browser';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, Subscription, firstValueFrom, map } from 'rxjs';
import { News, User } from '../../interfaces/interfaces';
import { BookmarksService } from '../storage/news/bookmarks.service';

@Injectable({
  providedIn: 'root',
})
export class NewsService implements OnDestroy {
  private http = inject(HttpClient);
  private bookmarksService = inject(BookmarksService);
  private utils = inject(UtilsService);
  private auth = inject(AuthService);

  private user: User | undefined;
  private user$: Subscription | undefined;
  private bookmarks$ = new BehaviorSubject<News[]>([]);
  private bookmarksSub$: Subscription | undefined;

  constructor() {
    this.user$ = this.auth.authState.subscribe((user) => {
      if (user) {
        this.user = user;

        this.bookmarksSub$ = this.bookmarksService
          .getBookmarks(this.user)
          .subscribe((news: any) => {
            this.bookmarks$.next(news);
          });
      }
    });
  }

  ngOnDestroy() {
    this.user$?.unsubscribe();
    this.bookmarksSub$?.unsubscribe();
  }

  getObsBookmarks() {
    return this.bookmarks$.asObservable();
  }

  getNews(qtd: number = 10, page: number = 1) {
    return this.http
      .get<any[]>(
        `https://servicodados.ibge.gov.br/api/v3/noticias/?qtd=${qtd}&page=${page}`
      )
      .pipe(
        map((data: any) =>
          data.items.map((news: any) => {
            const images = JSON.parse(news.imagens);

            const imageLink = `https://agenciadenoticias.ibge.gov.br/${images.image_intro}`;

            return {
              id: news.id,
              title: news.titulo,
              date: news.data_publicacao
                ? news.data_publicacao.substring(0, 10)
                : '',
              intro: news.introducao,
              image: imageLink,
              link: news.link,
              saved: false,
              likes: 0,
            };
          })
        )
      );
  }

  searchNews(qtd: number = 10, page: number = 1, query: string) {
    return this.http.get<News[]>(
      `https://servicodados.ibge.gov.br/api/v3/noticias/?qtd=${qtd}&page=${page}&busca=${query}`
    );
  }

  async toggleBookmarksStorage(news: News) {
    if (this.user) {
      const doc = await firstValueFrom(
        this.bookmarksService.getBookmark(this.user, news)
      );

      if (doc.exists) {
        await this.bookmarksService.delBookmark(this.user, news);
        return false;
      }

      news.saved = true;
      await this.bookmarksService.setBookmark(this.user, news);
      return true;
    }

    await this.utils.toastMessage({
      message: 'Faça login para salvar notícias',
    });
    throw new Error('Usuário não autenticado');
  }

  async copyLink(link: string) {
    try {
      await Clipboard.write({
        string: link,
      });
    } catch {
      this.utils.toastMessage({
        message: 'Erro ao copiar link',
        color: 'danger',
      });
    }
  }

  async shareNews(url: string) {
    try {
      await Share.share({
        url,
      });
    } catch {
      console.error('Error');
    }
  }

  async openNews(url: string) {
    try {
      await Browser.open({ url });
    } catch {
      this.utils.toastMessage({
        message: 'Erro ao abrir notícia',
        color: 'danger',
      });
    }
  }
}
