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
  IonText,
  IonIcon,
  IonListHeader,
  IonToggle,
  IonInput,
  IonButton,
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';
import { fingerPrintOutline } from 'ionicons/icons';
import { StorageService } from 'src/app/services/storage.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss', '../../app.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonInput,
    IonToggle,
    IonListHeader,
    IonIcon,
    IonText,
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
export class ProfilePage {
  user: any = {};
  hasBiometry: boolean = false;
  isNative: boolean = this.auth.isNative;
  constructor(
    private auth: AuthService,
    private storage: StorageService,
    private toast: ToastController
  ) {
    addIcons({
      fingerPrintOutline,
    });
  }

  async ionViewWillEnter() {
    this.user = await this.auth.getUser();

    this.storage.getBiometricPreferences().then((hasBiometry: boolean) => {
      this.hasBiometry = hasBiometry;
    });
  }

  biometry(event: any) {
    this.hasBiometry = event.detail.checked;
    this.storage.setBiometricPreferences(this.hasBiometry).catch(() => {
      this.toast
        .create({
          message: `Erro ao salvar preferência de biometria.`,
          duration: 2000,
        })
        .then((toast) => toast.present());
    });
  }
}
