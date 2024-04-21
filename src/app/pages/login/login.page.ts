import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
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
  IonText,
  IonCheckbox,
  IonToggle,
  IonItem,
  IonCard,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  enterOutline,
  eyeOffOutline,
  eyeOutline,
  fingerPrint,
  logInOutline,
} from 'ionicons/icons';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonItem,
    IonToggle,
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

  showPassword: boolean = false;

  error: string | null = null;
  message: string | null = null;

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
      enterOutline,
      addCircleOutline,
      fingerPrint,
      eyeOutline,
      eyeOffOutline,
      logInOutline,
    });
  }

  ionViewWillEnter() {
    this.menu.enable(false);
    this.storage.getBiometricPreferences().then((biometry) => {
      this.hasBiometry = biometry;
    });
  }
  ionViewWillLeave() {
    this.menu.enable(true);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
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
    this.message = null;
    this.error = null;
    this[field] = message;
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
    this.messageTimeout = setTimeout(
      () => {
        this[field] = null;
      },
      sucess ? 10000 : 6000
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
    try {
      await this.showLoading();
      const error = await this.auth.emailSignIn(email, password);
      await this.dimisLoading();

      if (error) return this.showMessage(error);

      this.router.navigate(['/']);
    } catch {
      this.showMessage('Erro interno do servidor');
    }
  }

  async emailRegister(email: string, password: string) {
    try {
      await this.showLoading();
      const error = await this.auth.createUser(email, password);
      await this.dimisLoading();

      if (error) return this.showMessage(error);

      return this.showMessage(
        'Usuário criado com sucesso, verfique seu e-mail.',
        true
      );
    } catch {
      this.showMessage('Erro interno do servidor');
    }
  }

  async googleAuth() {
    try {
      const error = await this.auth.googleSignIn();

      error ? this.showMessage(error) : this.router.navigate(['/']);
    } catch {
      this.showMessage('Erro interno do servidor');
    }
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
