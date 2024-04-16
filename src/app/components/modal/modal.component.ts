import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonInput,
  IonToolbar,
  IonContent,
  IonTitle,
  IonItem,
  IonButton,
  IonButtons,
  ModalController,
  IonModal,
  IonIcon,
  IonText,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [
    IonText,
    CommonModule,
    IonIcon,
    IonModal,
    IonButton,
    IonToolbar,
    IonInput,
    IonHeader,
    IonContent,
    IonTitle,
    IonItem,
    IonButtons,
    FormsModule,
  ],
})
export class ModalComponent {
  emailReset: string = '';
  message: any = '';
  success: boolean = false;
  private messageTimeout: any;

  constructor(private modalCtrl: ModalController, private auth: AuthService) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async confirm() {
    try {
      const error = await this.auth.resetPassword(this.emailReset);

      if (error) {
        return this.showMessage(error);
      }

      this.success = true;
      return this.showMessage(
        'E-mail de recuperação enviado com sucesso',
      );
    } catch (error) {
      return this.modalCtrl.dismiss(error, 'error');
    }
  }

  private showMessage(message: string) {
    this.message = message;

    if (this.messageTimeout) clearTimeout(this.messageTimeout);
    this.messageTimeout = setTimeout(
      () => {
        this.message = null;
        this.success = false;
      },
      this.success  ? 10000 : 5000
    );
  }
}
