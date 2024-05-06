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
  private loadingControler = inject(LoadingController);
  private alertController = inject(AlertController);

  private loading: any;

  constructor() {}

  alertMessage(fields: AlertOptions) {
    const { header, subHeader, message, buttons } = fields;

    this.alertController
      .create({
        header,
        subHeader,
        message,
        buttons,
      })
      .then((alert) => alert.present())
      .catch((error) => console.error(error));
  }

  async toastMessage(fields: ToastOptions) {
    const { header, message, color, buttons } = fields;

    const toast = await this.toast.create({
      header,
      message,
      color,
      buttons,
      swipeGesture: 'vertical',
      duration: 4000,
    });

    await toast.present();
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
