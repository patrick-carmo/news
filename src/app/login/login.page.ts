import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  error: any;
  private loading: any;
  private messageTimeout: any;

  constructor(
    public auth: AuthService,
    private loadingControler: LoadingController,
    private router: Router
  ) {}

  private errorMessage(message: string) {
    this.error = message;
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
    this.messageTimeout = setTimeout(() => {
      this.error = null;
    }, 5000);
  }

  async emailAuth(email: string, password: string) {
    await this.showLoading();
    const error = await this.auth.emailSignIn(email, password);
    await this.dimisLoading();

    error ? this.errorMessage(error) : this.router.navigate(['/']);
  }

  async googleAuth() {
    await this.showLoading();
    const error = await this.auth.googleSignIn();
    await this.dimisLoading();

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
