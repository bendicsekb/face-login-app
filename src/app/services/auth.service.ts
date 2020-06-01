import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  id = '';
  name = '';

  login(id: string, name: string) {
    this.name = name;
    this.id = id;
    this.isLoggedIn = true;
  }

  logout() {
    this.id = '';
    this.isLoggedIn = false;
  }
}
