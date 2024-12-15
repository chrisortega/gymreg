import { Component, OnInit } from '@angular/core';
import { GymService } from 'src/app/services/gym.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.page.html',
  styleUrls: ['./manage-users.page.scss'],
})
export class ManageUsersPage implements OnInit {
  users: any[] = [{id:"",name:"",image:{data:""},exp:""}];
  

  constructor( private gymService: GymService) {}

  ngOnInit() {
    this.loadUsers();
  }

  // Load users
  loadUsers() {   
    this.gymService.getUsersByGym().subscribe((data) => {
      console.log(data)
      this.users = data;
      for (let index = 0; index < this.users.length; index++) {

        
      }
      
    });
  }
  deleteUser(user_id:string){

  }

  isExpired(expirationDate: string): boolean {
    return this.gymService.isExpired(expirationDate)
  }

  bufferToBase64(data: any){
    
    if (data){
      return this.gymService.bufferToBase64(data)
    }
    return null
    
  }
}
