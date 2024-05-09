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

  private loading: any;

  constructor() {}

  async alertMessage(fields: AlertOptions) {
    try {
      const { header, subHeader, message, buttons } = fields;

      const alert = await this.alertCtrl.create({
        header,
        subHeader,
        message,
        buttons: buttons || ['OK'],
      });

      await alert.present();
    } catch {
      console.error('Erro ao exibir alerta!');
    }
  }

  async toastMessage(fields: ToastOptions) {
    try {
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
    } catch {
      console.error('Erro ao exibir toast!');
    }
  }

  async showLoading(message: string = 'Enviando...') {
    try {
      this.loading = await this.loadingCtrl.create({
        message,
      });

      await this.loading.present();
    } catch {
      console.error('Erro ao exibir loading!');
    }
  }

  async dimisLoading() {
    try {
      if (this.loading) {
        await this.loading.dismiss();
      }
    } catch {
      console.error('Erro ao fechar loading!');
    }
  }
}
