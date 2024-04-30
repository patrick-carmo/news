import { Injectable, inject } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  private auth = inject(AuthService);
  constructor() {}

  async canActivate() {
    try {
      const user = this.auth.getUser;

      if (user) {
        this.auth.refreshToken(user);
        return true;
      }

      const authState = await this.auth.authState.pipe(take(1)).toPromise();

      if (authState) {
        return true;
      }

      this.auth.router.navigate(['/login']);
      return false;
    } catch {
      this.auth.router.navigate(['/login']);
      return false;
    }
  }
}
