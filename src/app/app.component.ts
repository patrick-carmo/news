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
  IonAvatar,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  bookmarkOutline,
  codeWorkingOutline,
  exitOutline,
  newspaperOutline,
  personCircleOutline,
} from 'ionicons/icons';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonCol,
    IonRow,
    IonGrid,
    IonChip,
    IonAvatar,
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
export class AppComponent implements OnInit {
  name: string | null = null;
  email: string | null | undefined = null;
  photo: string | null = null;
  constructor(public auth: AuthService) {
    addIcons({
      newspaperOutline,
      personCircleOutline,
      exitOutline,
      codeWorkingOutline,
      bookmarkOutline,
    });
  }

  ngOnInit() {
    this.auth.getUser().then((user: any) => {
      this.name = user?.displayName || null;
      this.email = user?.email || null;
      this.photo = user?.photoURL || null;
    });
  }
}
