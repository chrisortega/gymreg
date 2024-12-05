import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
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
  

  constructor(private gymService:GymService, private auth:AuthService) {}

  imageSrc: string | undefined;

  reloadEntries(){
    this.gymService.getEntriesFromToday().subscribe(entries=>{
      this.entries = entries
    })
  }

  ngOnInit(){

    var data = this.auth.getGymData()

    this.imageSrc = this.bufferToBase64(data['image']['data']);

    this.reloadEntries()
  }

  bufferToBase64(buffer: ArrayBuffer): string {
    const byteArray = new Uint8Array(buffer);
    const base64String = btoa(String.fromCharCode.apply(null, Array.from(byteArray)));
    return base64String;
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
