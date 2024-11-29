import { Component } from '@angular/core';
import { GymService } from 'src/app/services/gym.service';

@Component({
  selector: 'app-check-subscriptions',
  templateUrl: './check-subscriptions.page.html',
  styleUrls: ['./check-subscriptions.page.scss'],
})
export class CheckSubscriptionsPage {
  membershipId: string = '';
  checkedUsers: any[] = []; // List of users whose subscriptions were checked
  userFound: boolean = false; // Flag to check if user is found
  checked: boolean = false; // Flag to indicate a check was performed
  entries: any[] = []

  constructor(private gymService:GymService) {}

  reloadEntries(){
    this.gymService.getEntriesFromToday().subscribe(entries=>{
      this.entries = entries
    })
  }

  ngOnInit(){
    this.reloadEntries()
  }

   checkSubscription() {
    this.checked = true; // Indicate a check has been performed

 
    this.gymService.getUser(this.membershipId).subscribe(user=>{
      if (user) {
        this.userFound = true;
        var exist = this.entries.find((item) => item.users_id === user.id);
        
        if (exist){
          alert("este usuario ya ingreso hoy")
        }else{
          this.gymService.addEntry(user.id).subscribe(data=>{
            this.reloadEntries()
          })  

        }
        //

      } else {
        this.userFound = false;
       alert("usuario no existe")
      }
  
      // Clear the input field after checking
      this.membershipId = '';
    })


  }

  // Function to check if the expiration date has passed
  isExpired(expirationDate: string): boolean {

    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    return expirationDate < today; // Check if expiration date is in the past
  }
}
