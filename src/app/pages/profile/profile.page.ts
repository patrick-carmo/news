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
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/interfaces/interfaces';

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
  user: User | null;
  hasBiometry: boolean = false;
  isNative: boolean = this.auth.isNative;
  loginWithEmail: boolean = false;
  constructor(
    private auth: AuthService,
    private storage: StorageService,
    private utils: UtilsService
  ) {
    addIcons({
      fingerPrintOutline,
    });

    this.user = this.auth.getUser;

    this.storage.getBiometricPreferences().then((hasBiometry: boolean) => {
      this.hasBiometry = hasBiometry;
    });

    this.storage.getLoginType().then((loginType: string) => {
      this.loginWithEmail = loginType === 'email';
    });
  }

  async biometry(event: any) {
    try {
      this.hasBiometry = event.detail.checked;
      await this.storage.setBiometricPreferences(this.hasBiometry);
    } catch {
      await this.utils.toastMessage({
        message: `Erro ao salvar preferência de biometria.`,
        duration: 2000,
      });
    }
  }
}
