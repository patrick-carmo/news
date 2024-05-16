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
  protected readonly devs: {
    name: string;
    role?: string;
    img?: string;
    description?: string;
  }[] = [
    {
      name: 'Felipe Guedes',
      img: '../../assets/img/felipe.jpg',
    },
    {
      name: 'Iure Freire',
      img: '../../assets/img/iure.jpg',
    },
    {
      name: 'Lorrany Ferreira',
      img: '../../assets/img/lorrany.jpg',
    },
    {
      name: 'Patrick',
      // role: 'Desenvolvedor Back-End',
      img: '../../assets/img/patrick.jpg',
      // description:
      //   'JavaScript | TypeScript | Node.js | Express.js | Nest.js | PostgreSQL',
    },
    {
      name: 'Thayná Miranda',
      img: '../../assets/img/thayna.jpg',
      // description: 'Estudante de Análise e Desenvolvimento de Sistema.',
    },
  ];

  constructor() {}

  async ionViewWillEnter() {
    registerSwiper();
  }
}
