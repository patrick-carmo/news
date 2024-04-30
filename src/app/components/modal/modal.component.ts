import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
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
    ReactiveFormsModule,
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
  private modalCtrl = inject(ModalController);
  private auth = inject(AuthService);
  private form = inject(FormBuilder).group({
    emailReset: ['', Validators.required],
  });

  protected emailReset: string = '';
  protected message: string | null = '';
  protected success: boolean = false;
  private messageTimeout: any;

  constructor() {}

  protected cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  protected async confirm() {
    try {
      const error = await this.auth.resetPassword(this.emailReset);

      if (error) {
        return this.showMessage(error);
      }

      this.success = true;
      return this.showMessage(
        'E-mail de recuperação enviado com sucesso. Verifique sua caixa de entrada.'
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
      this.success ? 10000 : 5000
    );
  }
}
