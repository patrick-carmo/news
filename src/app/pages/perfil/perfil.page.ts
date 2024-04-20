import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonList,
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
import { HeaderComponent } from 'src/app/components/header/header.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss', '../../app.component.scss'],
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
})
export class PerfilPage {
  user: any = {};
  constructor(private auth: AuthService) {}

  ionViewWillEnter() {
    this.auth.getUser().subscribe((user) => {
      this.user = user;
    });
  }
}
