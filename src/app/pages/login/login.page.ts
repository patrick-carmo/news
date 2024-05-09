import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
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
import { AuthService } from 'src/app/services/auth/auth.service';
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
import { UtilsService } from 'src/app/services/utils.service';
import { AuthForm } from 'src/app/interfaces/interfaces';
import { ResetPasswordComponent } from 'src/app/components/reset-password/reset-password.component';
import { UserPreferencesService } from 'src/app/services/storage/user-preferences.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    ResetPasswordComponent,
    ReactiveFormsModule,
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
  private userPrefService = inject(UserPreferencesService);
  private menu = inject(MenuController);
  private modalCtrl = inject(ModalController);
  private utils = inject(UtilsService);
  protected form: FormGroup<AuthForm> = inject(FormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
        ),
      ],
    ],
    confirmPassword: ['', Validators.nullValidator],
  });

  protected formType: 'login' | 'register' = 'login';

  protected isNative: boolean = this.auth.isNative;
  protected hasBiometry: boolean = false;

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
    this.userPrefService.getBiometricPreferences().then((biometry) => {
      this.hasBiometry = biometry;
    });
  }
  ionViewWillLeave() {
    this.menu.enable(true);
  }

  segmentChanged(event: CustomEvent) {
    if (event.detail.value === 'register') {
      this.form
        .get('confirmPassword')
        ?.setValidators([
          Validators.required,
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
          ),
        ]);

      return this.form.get('confirmPassword')?.updateValueAndValidity();
    }

    this.form.get('confirmPassword')?.clearValidators();
  }

  protected togglePassword(field: 'password' | 'confirmPassword' = 'password') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
      return;
    }

    this.showPasswordConfirm = !this.showPasswordConfirm;
  }

  protected async openModal() {
    const modal = await this.modalCtrl.create({
      component: ResetPasswordComponent,
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

  protected operation() {
    try {
      if (this.form.invalid)
        return this.showMessage('Preencha corretamente os campos');

      const { email, password, confirmPassword } = this.form.value;

      if (!email || !password)
        return this.showMessage('Preencha todos os campos');

      if (this.formType === 'login') {
        return this.emailAuth(email, password);
      }

      if (confirmPassword !== password)
        return this.showMessage('As senhas não coincidem');

      return this.emailRegister(email, password, confirmPassword);
    } catch {
      this.showMessage('Erro interno do servidor');
    }
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

  private async emailAuth(email: string, password: string) {
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

  private async emailRegister(
    email: string,
    password: string,
    passwordConfirm: string
  ) {
    if (password !== passwordConfirm) {
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
