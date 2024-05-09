import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonText,
  IonIcon,
  IonButtons,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonIcon,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonText,
    IonButton,
    IonInput,
    IonItem,
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
  ],
})
export class ResetPasswordComponent {
  private modalCtrl = inject(ModalController);
  private auth = inject(AuthService);
  protected resetForm = inject(FormBuilder).group({
    resetEmail: ['', [Validators.required, Validators.email]],
  });

  protected message: string | null = '';
  protected success: boolean = false;
  private messageTimeout: any;

  constructor() {}

  protected cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  protected async confirm() {
    try {
      if (this.resetForm.invalid) {
        return this.showMessage('E-mail inválido.');
      }

      const resetEmail = this.resetForm.get('resetEmail')?.value;

      if (!resetEmail) return this.showMessage('E-mail inválido.');

      const error = await this.auth.resetPassword(resetEmail);

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
