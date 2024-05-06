import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { UtilsService } from './utils.service';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';
import { Browser } from '@capacitor/browser';
import { AuthService } from './auth.service';
import { BehaviorSubject, Subscription, firstValueFrom } from 'rxjs';
import { News, User } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class NewsService implements OnDestroy {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private utils = inject(UtilsService);
  private auth = inject(AuthService);

  private user: User | null;
  private bookmarks$ = new BehaviorSubject<News[]>([]);
  private bookmarksSub$: Subscription | undefined;

  constructor() {
    this.user = this.auth.getUser;

    if (this.user) {
      this.bookmarksSub$ = this.storage
        .getBookmarks(this.user)
        .subscribe((news: any) => {
          this.bookmarks$.next(news);
        });
    }
  }

  ngOnDestroy() {
    this.bookmarksSub$?.unsubscribe();
  }

  getObsBookmarks() {
    return this.bookmarks$.asObservable();
  }

  getNews(qtd: number = 10, page: number = 1) {
    return this.http.get<News[]>(
      `https://servicodados.ibge.gov.br/api/v3/noticias/?qtd=${qtd}&page=${page}`
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
        this.storage.getBookmark(this.user, news)
      );

      if (doc.exists) {
        await this.storage.delBookmark(this.user, news);
        return false;
      }

      news.saved = true;
      await this.storage.setBookmark(this.user, news);
      return true;
    }

    await this.utils.toastMessage({
      message: 'Faça login para salvar notícias',
      color: 'warning',
    });
    throw new Error('Usuário não autenticado');
  }

  async copyLink(link: string) {
    try {
      await Clipboard.write({
        string: link,
      });
    } catch {
      this.utils
        .toastMessage({
          message: 'Erro ao copiar link',
          color: 'danger',
        })
        .catch(() => console.error('Error'));
    }
  }

  async shareNews(url: string) {
    try {
      await Share.share({
        url,
      });
    } catch {
      this.utils
        .toastMessage({
          message: 'Erro ao compartilhar notícia',
          color: 'danger',
        })
        .catch(() => console.error('Error'));
    }
  }

  async openNews(url: string) {
    try {
      await Browser.open({ url });
    } catch {
      this.utils
        .toastMessage({
          message: 'Erro ao abrir notícia',
          color: 'danger',
        })
        .catch(() => console.error('Error'));
    }
  }
}
