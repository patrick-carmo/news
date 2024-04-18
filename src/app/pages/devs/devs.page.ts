import { HeaderComponent } from 'src/app/components/header/header.component';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonList,
  IonItem,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonImg,
  IonAccordionGroup,
  IonAccordion,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
} from '@ionic/angular/standalone';
import { register as registerSwiper } from 'swiper/element/bundle';

@Component({
  selector: 'app-devs',
  templateUrl: './devs.page.html',
  styleUrls: ['./devs.page.scss', '../../app.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    IonList,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonMenuButton,
    IonImg,
    IonAccordionGroup,
    IonAccordion,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DevsPage {
  constructor() {}

  ionViewWillEnter(){
    registerSwiper()
  }
}
