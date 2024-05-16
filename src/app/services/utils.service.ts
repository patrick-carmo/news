import { Injectable, inject } from '@angular/core';
import {
  LoadingController,
  ToastController,
  ToastOptions,
  AlertController,
  AlertOptions,
} from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private toast = inject(ToastController);
  private loadingCtrl = inject(LoadingController);
  private alertCtrl = inject(AlertController);

  private loading: HTMLIonLoadingElement | null = null;

  constructor() {}

  async alertMessage(fields: AlertOptions) {
    const { header, subHeader, message, buttons, inputs } = fields;

    const alert = await this.alertCtrl.create({
      header,
      inputs: inputs || [],
      subHeader,
      message,
      buttons: buttons || ['OK'],
    });

    await alert.present();
  }

  async toastMessage(fields: ToastOptions) {
    const { header, message, duration, color, buttons } = fields;

    const toast = await this.toast.create({
      header,
      message,
      color: color || 'warning',
      buttons,
      swipeGesture: 'vertical',
      duration: duration ?? 4000,
    });

    await toast.present();
  }

  async showLoading(message: string = 'Autenticando...') {
    this.loading = await this.loadingCtrl.create({
      message,
    });

    await this.loading.present();
  }

  async dimisLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }
}
