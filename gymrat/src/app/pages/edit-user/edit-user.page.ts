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
    this.router.navigate(['/manage-users']); // Navigate back to Manage Users page
  }
}
