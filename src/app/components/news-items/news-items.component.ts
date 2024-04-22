import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  IonItem,
  IonCard,
  IonImg,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonCardHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonFabList,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  bookmarkOutline,
  chevronDownCircleOutline,
  document,
  globe,
  shareSocialSharp,
} from 'ionicons/icons';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-news-items',
  templateUrl: './news-items.component.html',
  styleUrls: ['./news-items.component.scss', '../../app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonItem,
    IonCard,
    IonImg,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonFab,
    IonFabButton,
    IonIcon,
    IonFabList,
  ],
})
export class NewsItemsComponent {
  @Input() items: any;
  constructor(public news: NewsService) {
    addIcons({
      shareSocialSharp,
      document,
      globe,
      chevronDownCircleOutline,
      bookmarkOutline,
    });
  }
}
