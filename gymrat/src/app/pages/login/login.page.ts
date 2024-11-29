import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';
import { GymService } from 'src/app/services/gym.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private gymService: GymService, private router: Router, private auth:AuthService) {}


  onLogin() {
    this.gymService.login(this.email, this.password).subscribe({

      next: (response) => {
        // Handle successful response
        console.log('Data fetched successfully:', response);
        this.auth.login(response["access_token"])
        this.router.navigate(['/'])
        //this.data = response;
      },
      error: (error) => {
        // Handle error response
        console.error('Error fetching data:', error);
        //this.errorMessage = 'Failed to fetch data. Please try again later.';
      },
      complete: () => {
        // Optional: Handle completion
        console.log('Request completed.');
      },

      
      ///this.router.navigate(['/manage-users']); // Redirect after successful login

    })
    
  }

  onForgotPassword() {
    alert('Redirect to Forgot Password page'); // Replace with actual navigation
  }

  onSignUp() {
    alert('Redirect to Sign Up page'); // Replace with actual navigation
  }
}
