import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
import { HomePage } from 'src/app/pages/home/home.page';

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
  @Input() news: any;
  constructor(public home: HomePage) {
  }
}
