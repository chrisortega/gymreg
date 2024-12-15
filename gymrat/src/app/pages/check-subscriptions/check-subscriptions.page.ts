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
  
  currentDateTime: string = "";

  constructor(private gymService:GymService, private auth:AuthService) {}

  imageSrc: string | undefined;

  reloadEntries(){
    this.gymService.getEntriesFromToday().subscribe(entries=>{

      


        this.entries = entries

      
    })
  }

  ngOnInit(){

    var data = this.auth.getGymData()

    this.reloadEntries()

    this.updateDateTime();
    setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }


   checkSubscription() {
    this.checked = true; // Indicate a check has been performed

 
    this.gymService.getUser(this.membershipId).subscribe(user=>{
      if (user) {
        this.userFound = true;
        var exist = this.entries.find((item) => item.users_id === user.id);
        
        if (exist){
          alert("Este usuario ya ingreso hoy")
        }else{
          this.gymService.addEntry(user.id).subscribe(

            {
              next: (data) => {
                if ('error' in data) {
                  console.log(data.message);
                } else {
                  console.log('Data received:', data);
                  this.reloadEntries()
                }
              },
              error: (err) => {
                alert(err.error)
                console.error('Unexpected Error:', err);
              },
            }

          )  

        }
        //

      } else {
        this.userFound = false;
       alert("Usuario no existe")
      }
  
      // Clear the input field after checking
      this.membershipId = '';
    })


  }

  // Function to check if the expiration date has passed
  isExpired(expirationDate: string): boolean {
    return this.gymService.isExpired(expirationDate)
  }
  updateDateTime() {
    const now = new Date();
    this.currentDateTime = now.toLocaleString('es-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  bufferToBase64(data: any){
    if (data){
      return this.gymService.bufferToBase64(data)
    }
    return null
    
  }
}
