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
  ToastController,
} from '@ionic/angular/standalone';
import { NewsService } from 'src/app/services/news.service';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';
import { Browser } from '@capacitor/browser';
import { addIcons } from 'ionicons';
import { document, globe, shareSocialSharp } from 'ionicons/icons';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss', '../../app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
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
    IonInfiniteScrollContent
  ],
})
export class HomePage implements OnInit {
  public items: any = [];
  private page: number = 1;
  private readonly qtyItems: number = 15;

  constructor(private news: NewsService, private toast: ToastController) {}

  ngOnInit() {
    addIcons({
      "share-social-sharp": shareSocialSharp,
      "document": document,
      "globe": globe
    })
    this.generateItems();
  }

  private generateItems() {
    this.news.getNews(this.qtyItems, this.page).subscribe(
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
        await this.toastMessage('Erro', 'Erro ao carregar notícias');
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
    } catch (error: any) {
      this.toastMessage('Erro', error.message);
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

  async toastMessage(header: string, message: string){
    const toastMessage = await this.toast.create({
      header,
      message,
      duration: 3500,
    });

    await toastMessage.present();
  }
}
