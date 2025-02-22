




import { Component } from '@angular/core';
import { GymService } from 'src/app/services/gym.service';
import { Route, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage {
  user: any = {
    id: '',
    name: '',
    exp: '',
    gym_id: '',
  };
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  imageSrc: string | undefined;


  constructor(private userService: GymService,private route: ActivatedRoute,
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;

      // Generate an image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  ngOnInit() {
    // Get the user ID from the route parameter
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {

      this.user.id = userId;
      this.userService.getUser(userId).subscribe(data => {  
        this.user = data     
        try {
          this.imageSrc = this.userService.bufferToBase64(this.user['image']['data']);    
        } catch (error) {
          
        }
        
        

      })
    }
  }

  saveUser() {
    const formData = new FormData();
    formData.append('id', this.user.id);
    formData.append('name', this.user.name);
    formData.append('exp', this.user.exp.split("T")[0]);
    formData.append('gym_id', this.user.gym_id);

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.userService.updateUser(formData)
  }
}

