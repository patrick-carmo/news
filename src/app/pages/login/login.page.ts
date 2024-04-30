import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
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
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  enterOutline,
  eyeOffOutline,
  eyeOutline,
  fingerPrint,
  logInOutline,
  logoGoogle,
} from 'ionicons/icons';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { StorageService } from 'src/app/services/storage.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    ModalComponent,
    IonCard,
    IonItem,
    IonToggle,
    IonCheckbox,
    IonText,
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
  private auth = inject(AuthService);
  private storage = inject(StorageService);
  private menu = inject(MenuController);
  private modalCtrl = inject(ModalController);
  private utils = inject(UtilsService);

  protected formType: 'login' | 'register' = 'login';

  protected isNative: boolean = this.auth.isNative;
  protected hasBiometry: boolean = false;

  protected email: string = '';
  protected password: string = '';
  protected passwordConfirm: string = '';

  protected showPassword: boolean = false;
  protected showPasswordConfirm: boolean = false;

  protected error: string | null = null;
  protected message: string | null = null;

  private messageTimeout: any;

  constructor() {
    addIcons({
      enterOutline,
      addCircleOutline,
      fingerPrint,
      eyeOutline,
      eyeOffOutline,
      logInOutline,
      logoGoogle,
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

  protected togglePassword(field: 'password' | 'passwordConfirm' = 'password') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
      return;
    }

    this.showPasswordConfirm = !this.showPasswordConfirm;
  }

  protected async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      cssClass: 'login-modal',
      breakpoints: [0, 0.4, 1],
      initialBreakpoint: 0.4,
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

  protected async biometryAuth() {
    if (!this.isNative) return this.showMessage('Biometria não disponível');

    try {
      const data = await this.auth.performBiometricVerification();
      if (!data) return;

      if (typeof data === 'string') {
        return this.showMessage(data);
      }

      await this.emailAuth(data.username, data.password);
    } catch (error) {
      this.showMessage('Erro interno do servidor');
    }
  }

  protected async emailAuth(email: string, password: string) {
    try {
      await this.utils.showLoading();
      const error = await this.auth.emailSignIn(email, password);
      await this.utils.dimisLoading();

      if (error) return this.showMessage(error);

      this.auth.router.navigate(['/']);
    } catch {
      this.showMessage('Erro interno do servidor');
    }
  }

  protected async emailRegister(email: string, password: string) {
    if (this.password !== this.passwordConfirm) {
      return this.showMessage('As senhas não coincidem');
    }

    try {
      await this.utils.showLoading();
      const error = await this.auth.createUser(email, password);
      await this.utils.dimisLoading();

      if (error) return this.showMessage(error);

      return this.showMessage(
        'Usuário criado com sucesso, verfique seu e-mail.',
        true
      );
    } catch {
      this.showMessage('Erro interno do servidor');
    }
  }

  protected async googleAuth() {
    try {
      this.utils.showLoading('Autenticando...');
      const error = await this.auth.googleSignIn();
      this.utils.dimisLoading();

      error ? this.showMessage(error) : this.auth.router.navigate(['/']);
    } catch (error: any) {
      this.showMessage(error);
    }
  }
}
