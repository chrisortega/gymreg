import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from 'src/app/services/auth-service.service';
import { GymService } from 'src/app/services/gym.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
})
export class AddUserPage implements OnInit {
  user: any = {
    name: '',
    exp: '',
    photo_id: null,
    gym_id: null,
  };
  
  photoPreview: string | null = null;

  constructor(private storage: Storage, private auth:AuthService, private gymService: GymService) {}
  gymId = null
  async ngOnInit() {
    // Fetch gym_id from storage
    
    if (this.gymId) {
      this.user.gym_id = this.auth.getGymData()['gym_id']
      this.gymId
    }
  }

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Convert photo to base64 for preview and storage
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
        this.user.photo_id = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveUser() {
    console.log('User saved:', this.user);
    var gym_id = this.auth.getGymData()['gym_id']
    this.user.gym_id = gym_id
    this.gymService.addUser(this.user).subscribe(response=>{
      console.log(response.id)
      this.gymService.updateUserImage(response.id, this.user.photo_id).subscribe(response => {
        console.log(response)
      })
    })

    // Add logic to send user data to the backend or save locally
  }


  
}
