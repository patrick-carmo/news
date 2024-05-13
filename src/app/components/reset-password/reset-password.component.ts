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
import { UtilsService } from 'src/app/services/utils.service';

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
  private utils = inject(UtilsService);
  protected resetForm = inject(FormBuilder).group({
    resetEmail: ['', [Validators.required, Validators.email]],
  });

  constructor() {}

  protected cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  protected async confirm() {
    try {
      if (this.resetForm.invalid)
        return await this.utils.toastMessage({
          message: 'E-mail inválido.',
          duration: 2000,
        });

      const resetEmail = this.resetForm.get('resetEmail')?.value;

      if (!resetEmail)
        return await this.utils.toastMessage({
          message: 'E-mail inválido.',
          duration: 2000,
        });

      const error = await this.auth.resetPassword(resetEmail);

      if (error) return await this.utils.toastMessage({ message: error });

      return this.modalCtrl.dismiss(null, 'confirm');
    } catch {
      return this.modalCtrl.dismiss('Erro interno do servidor', 'error');
    }
  }
}
