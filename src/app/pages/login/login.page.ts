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
    } else {
      this.form.get('confirmPassword')?.clearValidators();
    }

    this.form.get('confirmPassword')?.updateValueAndValidity();
  }

  protected togglePassword(field: 'password' | 'confirmPassword' = 'password') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
      return;
    }

    this.showPasswordConfirm = !this.showPasswordConfirm;
  }

  protected async openResetPassword() {
    const modal = await this.modalCtrl.create({
      component: ResetPasswordComponent,
      breakpoints: [0, 0.4, 1],
      initialBreakpoint: 0.4,
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'error')
      return await this.utils.toastMessage({
        message: data,
        color: 'danger',
      });
  }

  protected async operation() {
    if (this.form.invalid)
      return await this.utils.toastMessage({
        message: 'Preencha corretamente os campos',
        duration: 2500,
      });

    const { email, password, confirmPassword } = this.form.value;

    if (!email || !password)
      return await this.utils.toastMessage({
        message: 'Preencha todos os campos',
        duration: 2500,
      });

    if (this.formType === 'login') {
      return await this.emailAuth(email, password);
    }

    if (confirmPassword !== password)
      return await this.utils.toastMessage({
        message: 'As senhas não coincidem',
        duration: 2500,
      });

    return await this.emailRegister(email, password, confirmPassword);
  }

  protected async biometryAuth() {
    if (!this.isNative)
      return await this.utils.toastMessage({
        message: 'Biometria não disponível',
      });

    const data = await this.auth.performBiometricVerification();
    if (!data) return;

    await this.emailAuth(data.username, data.password);
  }

  private async emailAuth(email: string, password: string) {
    await this.utils.showLoading();
    await this.auth.emailSignIn(email, password);
    await this.utils.dimisLoading();

    await this.auth.router.navigate(['/']);
  }

  private async emailRegister(
    email: string,
    password: string,
    passwordConfirm: string
  ) {
    if (password !== passwordConfirm)
      return await this.utils.toastMessage({
        message: 'As senhas não coincidem',
        duration: 2500,
      });

    await this.utils.showLoading('Cadastrando...');
    await this.auth.createUser(email, password);
    await this.utils.dimisLoading();

    return this.utils.toastMessage({
      message: 'Usuário criado com sucesso, verfique seu e-mail.',
      color: 'success',
      duration: 6000,
    });
  }

  protected async googleAuth() {
    await this.utils.showLoading();
    await this.auth.googleSignIn();
    await this.utils.dimisLoading();

    await this.auth.router.navigate(['/']);
  }
}
