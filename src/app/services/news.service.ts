import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { UtilsService } from './utils.service';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';
import { Browser } from '@capacitor/browser';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private utils: UtilsService,
    private auth: AuthService
  ) {}

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

  async toggleNewsStorage(news: any) {
    const user: any = await this.auth.getUser();

    const doc = await this.storage.getDoc(`${user?.email}-bookmarks`, news.id);

    if (!doc) throw new Error('Erro ao buscar notícia');

    if (doc.exists) {
      await this.storage.delDoc(`${user?.email}-bookmarks`, news.id);
      return 'Notícia removida dos favoritos';
    }

    await this.storage.setDoc(`${user?.email}-bookmarks`, news.id, news);
    return 'Notícia adicionada aos favoritos';
  }

  async copyLink(link: string) {
    try {
      await Clipboard.write({
        string: link,
      });
    } catch (error: any) {
      this.utils.toastMessage('Erro', error.message);
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

  async saveNews(news: any) {
    try {
      const message = await this.toggleNewsStorage(news);
      await this.utils.toastMessage('Info', message);
    } catch {
      await this.utils.toastMessage('Erro', 'Erro ao salvar notícia');
    }
  }
}
