import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  async canActivate() {
    try {
      await this.auth.isLogged();
      return true
    } catch {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
