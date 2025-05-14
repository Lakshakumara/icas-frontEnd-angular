import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthServiceService } from '../service/auth-service.service';

@Injectable({ providedIn: 'root' })
export class PasswordGuard implements CanActivate {
  constructor(private auth: AuthServiceService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const defaultPassword = this.auth.isDefaultPassword();

    if (defaultPassword && state.url !== '/change-password') {
      this.router.navigate(['/change-password']);
      return false;
    }

    if (!defaultPassword && state.url === '/change-password') {
      this.router.navigate(['/home']); // or wherever you want
      return false;
    }

    return true;
  }
}

