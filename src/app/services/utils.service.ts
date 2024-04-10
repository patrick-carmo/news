import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private toast: ToastController) {}

  public async toastMesage(header: string, message: string) {
    const toastMessage = await this.toast.create({
      header,
      message,
      duration: 3500,
    });

    toastMessage.present();
  }
}
