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
  IonInputPasswordToggle,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  MenuController,
  ModalController,
  IonText,
  IonCheckbox,
  IonToggle,
  IonItem,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { addCircleOutline, enterOutline, fingerPrint } from 'ionicons/icons';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonToggle,
    IonInputPasswordToggle,
    IonCheckbox,
    IonText,
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

  isNative: boolean = this.auth.isNative;
  hasBiometry: boolean = false;

  name: string = '';
  email: string = '';
  password: string = '';

  error: any;

  message: string = '';

  private loading: any;
  private messageTimeout: any;

  constructor(
    private auth: AuthService,
    public storage: StorageService,
    private loadingControler: LoadingController,
    private router: Router,
    private menu: MenuController,
    private modalCtrl: ModalController
  ) {
    addIcons({
      'log-in-outline': enterOutline,
      'add-circle-outline': addCircleOutline,
      'finger-print': fingerPrint,
    });
  }

  ionViewWillEnter() {
    this.menu.enable(false);
    this.storage.getBiometricPreferences().then((data) => {
      if (data) this.hasBiometry = data;
    });
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

  private showMessage(message: string, sucess: boolean = false) {
    const field = sucess ? 'message' : 'error';
    this[field] = message;
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
    this.messageTimeout = setTimeout(
      () => {
        this[field] = null;
      },
      sucess ? 5000 : 10000
    );
  }

  async biometryAuth() {
    if (!this.isNative) return this.showMessage('Biometria não disponível');

    try {
      const data = await this.auth.performBiometricVerification();
      if (!data) return;

      if (typeof data === 'string') {
        return this.showMessage(data);
      }

      await this.emailAuth(data.username, data.password);
    } catch {
      this.showMessage('Erro interno do servidor');
    }
  }

  async emailAuth(email: string, password: string) {
    await this.showLoading();
    this.storage.setBiometricPreferences(this.hasBiometry);
    const error = await this.auth.emailSignIn(email, password);
    await this.dimisLoading();

    if (error) return this.showMessage(error);

    this.router.navigate(['/']);
  }

  async emailRegister(email: string, password: string) {
    await this.showLoading();
    const error = await this.auth.createUser(email, password);
    await this.dimisLoading();

    if (error) return this.showMessage(error);

    this;
  }

  async googleAuth() {
    const error = await this.auth.googleSignIn();

    error ? this.showMessage(error) : this.router.navigate(['/']);
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
