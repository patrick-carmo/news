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
import { CustomError } from 'src/app/utils/error/custom-error';
import { LikesService } from '../storage/news/likes.service';

@Injectable({
  providedIn: 'root',
})
export class NewsService implements OnDestroy {
  private http = inject(HttpClient);
  private bookmarksService = inject(BookmarksService);
  private utils = inject(UtilsService);
  private auth = inject(AuthService);
  private likeService = inject(LikesService);

  private user: User | undefined;
  private user$: Subscription | undefined;
  private bookmarks$ = new BehaviorSubject<News[]>([]);
  private bookmarksSub$: Subscription | undefined;

  constructor() {
    this.user$ = this.auth.authState.subscribe((user) => {
      if (user) {
        this.user = user;

        if (!this.bookmarksSub$)
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
      .get(
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
    return this.http
      .get(
        `https://servicodados.ibge.gov.br/api/v3/noticias/?qtd=${qtd}&page=${page}&busca=${query}`
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

    throw new CustomError('Usuário não autenticado');
  }

  async formatNews(data: News[], bookmarks: News[] = []) {
    const newsData = data.map(async (item: News) => {
      const likes = await firstValueFrom(this.likeService.getLikes(item));

      item.likes = likes.length;

      item.liked = likes.some((doc: any) => {
        return doc.userId === this.auth.getUser?.uid;
      });

      if (bookmarks.length) {
        return {
          ...item,
          saved: bookmarks.some((doc: any) => doc.id === item.id),
        };
      }

      return item;
    });

    return await Promise.all(newsData);
  }

  async copyLink(link: string) {
    await Clipboard.write({
      string: link,
    });
  }

  async shareNews(url: string) {
    try {
      await Share.share({
        url,
      });
    } catch {
      console.error('Share aborted');
    }
  }

  async openNews(url: string) {
    await Browser.open({ url });
  }
}
