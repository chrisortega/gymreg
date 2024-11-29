import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  login(token: string): Boolean {
    localStorage.setItem('userToken', token);
    return true
  }

  logout() {
    localStorage.removeItem('userToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken');
  }

  getToken(): any {
    return localStorage.getItem('userToken') || "invalid_token"
  }
}
