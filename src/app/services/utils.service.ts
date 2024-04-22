import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private loading: any;

  constructor(
    private toast: ToastController,
    private loadingControler: LoadingController
  ) {}

  async toastMessage(header: string, message: string) {
    const toastMessage = await this.toast.create({
      header,
      message,
      duration: 3500,
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
