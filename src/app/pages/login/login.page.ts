import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  LoadingController,
  IonInput,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  MenuController,
  ModalController,
  ToastController,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { addCircleOutline, enterOutline } from 'ionicons/icons';
import { ModalComponent } from 'src/app/components/modal/modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    ModalComponent,
    IonIcon,
    IonInput,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonIcon,
  ],
})
export class LoginPage {
  type: 'login' | 'register' = 'login';
  name: string = '';
  email: string = '';
  password: string = '';
  error: any;
  private loading: any;
  private messageTimeout: any;

  constructor(
    public auth: AuthService,
    private loadingControler: LoadingController,
    private router: Router,
    private menu: MenuController,
    private modalCtrl: ModalController
  ) {
    addIcons({
      'log-in-outline': enterOutline,
      'add-circle-outline': addCircleOutline,
    });
  }

  ionViewWillEnter() {
    this.menu.enable(false);
  }
  ionViewWillLeave() {
    this.menu.enable(true);
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      cssClass: 'login-modal',
      breakpoints: [0.1, 0.5, 0.9],
      initialBreakpoint: 0.5,
    });
    await modal.present();
  }

  private errorMessage(message: string) {
    this.error = message;
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
    this.messageTimeout = setTimeout(() => {
      this.error = null;
    }, 5000);
  }

  async emailAuth(email: string, password: string) {
    await this.showLoading();
    const data = await this.auth.emailSignIn(email, password);
    await this.dimisLoading();

    if (typeof data === 'string') {
      return this.errorMessage(data);
    }

    this.router.navigate(['/']);
  }

  async emailRegister(name: string, email: string, password: string) {
    await this.showLoading();
    const error = await this.auth.createUser(name, email, password);
    await this.dimisLoading();

    error ? this.errorMessage(error) : this.router.navigate(['/']);
  }

  async googleAuth() {
    const error = await this.auth.googleSignIn();

    error ? this.errorMessage(error) : this.router.navigate(['/']);
  }

  private async showLoading() {
    this.loading = await this.loadingControler.create({
      message: 'Enviando...',
    });

    await this.loading.present();
  }

  private async dimisLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }
}
