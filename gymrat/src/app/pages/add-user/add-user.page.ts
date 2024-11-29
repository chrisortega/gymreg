import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GymService } from 'src/app/services/gym.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
})
export class AddUserPage {
  user = { id: '', name: '', expirationDate: '' };

  constructor(private gymService: GymService, private router: Router) {}

   saveUser() {
    
    this.gymService.addUser(this.user.name ).subscribe()
    this.router.navigate(['/manage-users']); // Navigate back to Manage Users page
  }
}
