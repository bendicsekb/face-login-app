import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  debug = true;
  constructor(private router: Router, private authService: AuthService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.debug) {
      console.log(next);
      console.log(state);
    }
    // If logged in then allowed to view
    if (this.authService.isLoggedIn && next.params.id === this.authService.id) {
      return true;
    }
    // If not allowed to view -> Log in
    this.router.navigateByUrl('authenticate');
    return false;
  }
}
