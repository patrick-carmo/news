import { Component } from '@angular/core';
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
import { AuthService } from './services/auth.service';
import { addIcons } from 'ionicons';
import { exitSharp, newspaperSharp, personSharp } from 'ionicons/icons';

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
  constructor(private auth: AuthService) {
    addIcons({
      'newspaper-sharp': newspaperSharp,
      'person-sharp': personSharp,
      'exit-sharp': exitSharp
    })
  }

  async logout() {
    await this.auth.signOut();
  }
}
