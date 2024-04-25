import { Injectable } from '@angular/core';
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
  private loading: any;

  constructor(
    private toast: ToastController,
    private loadingControler: LoadingController,
    private alertController: AlertController
  ) {}

  async alertMessage(fields: AlertOptions) {
    const { header, subHeader, message, buttons } = fields;

    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons,
    });

    await alert.present();
  }

  async toastMessage(fields: ToastOptions) {
    const { header, message, color, buttons } = fields;

    const toastMessage = await this.toast.create({
      header,
      message,
      color,
      buttons,
      swipeGesture: 'vertical',
      duration: 4000,
    });

    await toastMessage.present();
  }

  async showLoading(message: string = 'Enviando...') {
    this.loading = await this.loadingControler.create({
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
