import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router, private auth: AuthService) {}

  checkLoginStatus() {
    return this.auth.isLoggedIn()
  }

  logout() {
    // Clear login state
    this.auth.logout()
    
    this.router.navigate(['/login']); // Redirect to login page
  }

}
