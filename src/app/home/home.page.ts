import { UtilsService } from '../services/utils.service';
import { NewsService } from './../services/news.service';
import { Component, OnInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss', '../app.component.scss'],
})
export class HomePage implements OnInit {
  public items: any = [];
  private page: number = 1;
  private readonly qtyItems: number = 15;


  constructor(private newsService: NewsService, public utils: UtilsService, public auth: AuthService) {}

  ngOnInit() {
    this.generateItems();
  }

  private generateItems() {
    this.newsService.getNews(this.qtyItems, this.page).subscribe(
      (data: any) => {
        const items = data.items.map((item: any) => {
          const images = JSON.parse(item.imagens);
          const imageLink = `https://agenciadenoticias.ibge.gov.br/${images.image_intro}`;
          return {
            title: item.titulo,
            intro: item.introducao,
            date: item.data_publicacao
              ? item.data_publicacao.substring(0, 10)
              : '',
            image: imageLink,
            link: item.link,
          };
        });
        const filteredItems = items.filter(
          (newItem: any) =>
            !this.items.some((item: any) => item.link === newItem.link)
        );

        if (filteredItems.length > 0) {
          this.items = [...this.items, ...filteredItems];
          this.page++;
        }
        
      },
      async () => {
        await this.utils.toastMesage('Error', 'Erro ao carregar as notícias');
      }
    );
  }

  onIonInfinite(ev: any) {
    this.generateItems();
    setTimeout(() => {
      (
        (ev as InfiniteScrollCustomEvent).target as HTMLIonInfiniteScrollElement
      ).complete();
    }, 3000);
  }

  async copyLink(link: string) {
    try {
      await Clipboard.write({
        string: link,
      });
      await this.utils.toastMesage(
        '',
        'Link copiado para a área de transferência'
      );
    } catch (error: any) {
      await this.utils.toastMesage('Error', 'Erro ao copiar o link');
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
