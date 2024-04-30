import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { UtilsService } from './utils.service';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';
import { Browser } from '@capacitor/browser';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';
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
  private bookmarks$: Subscription | undefined;
  private bookmarks: News[] = [];

  constructor() {
    this.user = this.auth.getUser;

    if (this.user) {
      this.bookmarks$ = this.storage
        .getObsDocs(`${this.user.email}-bookmarks`)
        .subscribe((news: any) => {
          this.bookmarks = news;
        });
    }
  }

  ngOnDestroy() {
    this.bookmarks$?.unsubscribe();
  }

  getNews(qtd: number = 10, page: number = 1) {
    return this.http.get(
      `https://servicodados.ibge.gov.br/api/v3/noticias/?qtd=${qtd}&page=${page}`
    );
  }

  searchNews(qtd: number = 10, page: number = 1, query: string) {
    return this.http.get(
      `https://servicodados.ibge.gov.br/api/v3/noticias/?qtd=${qtd}&page=${page}&busca=${query}`
    );
  }

  getBookmarks() {
    return this.bookmarks;
  }

  async toggleBookmarksStorage(news: News) {
    if (this.user) {
      const doc = await this.storage.getDoc(
        `${this.user?.email}-bookmarks`,
        news.id
      );

      if (!doc) throw new Error('Erro ao buscar notícia');

      if (doc.exists) {
        await this.storage.delDoc(`${this.user?.email}-bookmarks`, news.id);
        return false;
      }

      news.saved = true;
      await this.storage.setDoc(`${this.user?.email}-bookmarks`, news.id, news);
      return true;
    }

    this.utils.toastMessage({
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
    } catch (error: any) {
      this.utils.toastMessage({ message: error.message, color: 'danger' });
    }
  }

  async shareNews(url: string) {
    try {
      await Share.share({
        url,
      });
    } catch {}
  }

  async openNews(url: string) {
    await Browser.open({ url });
  }
}
