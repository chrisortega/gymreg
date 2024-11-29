import { Component, OnInit } from '@angular/core';
import { GymService } from 'src/app/services/gym.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.page.html',
  styleUrls: ['./manage-users.page.scss'],
})
export class ManageUsersPage implements OnInit {
  users: any[] = [];

  constructor( private gymService: GymService) {}

  ngOnInit() {
    this.loadUsers();
  }

  // Load users
  loadUsers() {   
    this.gymService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }
  deleteUser(user_id:string){

  }

}
