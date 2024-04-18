import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonApp,
  IonRouterOutlet,
  IonItem,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonIcon,
  IonLabel,
  IonMenuToggle,
  IonRouterLink,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  codeWorkingOutline,
  exitOutline,
  newspaperOutline,
  personCircleOutline,
} from 'ionicons/icons';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonItem,
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonIcon,
    IonLabel,
    IonMenuToggle,
    IonRouterLink,
    RouterLink,
  ],
})
export class AppComponent {
  constructor(public auth: AuthService) {
    addIcons({
      newspaperOutline,
      personCircleOutline,
      exitOutline,
      codeWorkingOutline
    });
  }
}
