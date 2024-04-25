import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { Observable, Subscription } from 'rxjs';

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
export class AppComponent implements OnDestroy {
  name: string | null | undefined;
  email: string | null | undefined;
  photo: string | null | undefined;
  authFirebase$ = this.auth.authState;
  user$: Subscription;
  constructor(public auth: AuthService) {
    addIcons({
      newspaperOutline,
      personCircleOutline,
      exitOutline,
      codeWorkingOutline,
      bookmarkOutline,
    });

    this.user$ = this.authFirebase$.subscribe((user) => {
      if (user) {
        this.name = user.displayName;
        this.email = user.email;
        this.photo = user.photoURL;
      }
    });
  }

  ngOnDestroy(): void {
    this.user$.unsubscribe();
  }
}
