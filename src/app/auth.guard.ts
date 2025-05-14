import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthServiceService } from './service/auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthServiceService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const roles = next.data['roles'];
    if (!roles || roles.some((role: string) => this.authService.hasRole(role))) {
      return true;
    }

    // If the user doesn't have access, navigate to login
    this.router.navigate(['/signin']);
    return false;
  }
  /*canActivate(): boolean {
    const token = localStorage.getItem('token');
    const defaultPassword = localStorage.getItem('defaultPassword') === 'true';
  
    if (token && defaultPassword && this.router.url !== '/change-password') {
      this.router.navigate(['/change-password']);
      return false;
    }
  
    return true;
  }*/

}
