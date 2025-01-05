import { Injectable } from '@angular/core';
import { buffer } from 'rxjs';
import { GYMDATA } from '../models/gymdata.interface';
@Injectable({
  providedIn: 'root',
})


export class AuthService {
  login(token: string): Boolean {
    localStorage.setItem('userToken', token);
    return true
  }

  setVariables(response: {}){
    localStorage.setItem('gym_data', JSON.stringify(response));
    return true
  }

  logout() {
    localStorage.removeItem('gym_data');
    localStorage.removeItem('userToken');
    
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken');
  }

  getGymData(): GYMDATA {
    return JSON.parse(localStorage.getItem('gym_data')?.toString() || "{}")
  }

  getToken(): any {
    return localStorage.getItem('userToken') || "invalid_token"
  }
}
