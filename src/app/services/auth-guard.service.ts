import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Subscription, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate, OnDestroy {
  userState$: Subscription;
  user: any;

  constructor(private auth: AuthService, private router: Router) {
    this.userState$ = this.auth.authState.subscribe((user) => {
      this.user = user;
    });
  }

  async canActivate() {
    try {
      if (this.user) return true;

      if (!this.user) {
        this.user = await this.auth.authState.pipe(take(1)).toPromise();
        if (this.user) return true;
      }

      this.router.navigate(['/login']);
      return false;
    } catch {
      this.router.navigate(['/login']);
      return false;
    }
  }

  ngOnDestroy() {
    this.userState$.unsubscribe();
  }
}
