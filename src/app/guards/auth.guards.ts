import { Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
constructor(private router: Router) {}

canActivate: CanActivateFn = (route, state) => {
  const logueado = localStorage.getItem('logueado') === 'true';
  if (!logueado) {
    this.router.navigate(['/login']);
    return false;
  }
  return true;
};
}