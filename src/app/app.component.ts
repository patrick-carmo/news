import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private auth: AuthService) {}

  async signOut() {
    await this.auth.signOut();
  }

  async getUser() {
    console.log(await this.auth.getUser())
  }

  async verifyToken(){
    await this.auth.verifyToken()
  }
}
