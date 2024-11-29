import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router) {}

  checkLoginStatus() {
    return !!localStorage.getItem('userToken'); // Example token check
  }

  logout() {
    // Clear login state
    localStorage.removeItem('userToken'); // Example of removing a token
    this.router.navigate(['/login']); // Redirect to login page
  }

}
