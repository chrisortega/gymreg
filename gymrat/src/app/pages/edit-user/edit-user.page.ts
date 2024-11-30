import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { GymService } from 'src/app/services/gym.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit {
  user: any = { id: '', name: '', exp: '' };

  constructor(
    private route: ActivatedRoute,
    private gymService: GymService,
    private router: Router
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || ""; // Get user ID from route
    this.gymService.getUser(id).subscribe(user=>{
      if (user) {
        this.user = user;
      } else {
        console.error('User not found');
      }
    })


  }

  async saveUser() {
    this.gymService.saveUser(this.user).subscribe({
      next: (response) => {
        console.log('User saved successfully:', response);
        //this.navCtrl.back(); // Navigate back after saving
      },
      error: (error) => {
        console.error('Error saving user:', error);
        alert('An error occurred while saving the user.');
      },
    });
    
   // this.router.navigate(['/manage-users']); // Navigate back to Manage Users page
  }
}
