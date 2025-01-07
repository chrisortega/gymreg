import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { buffer } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service.service';
import { GymService } from 'src/app/services/gym.service';
import { AlertController, IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-gymadmin',
  templateUrl: './gymadmin.page.html',
  styleUrls: ['./gymadmin.page.scss'],
})
export class GymadminPage implements OnInit {
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  imageSrc: string | undefined;
  gym_data: any = {
    email: '',
    gym_id: '',
    image: '',
    userId: '',
    gym_name:''
    
  };
  @ViewChild(IonModal) modal!: IonModal;
  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  oldpassword:any
  newpassword:any
  confirmnewpassword:any
  passwordError: string | null = null;
  confirmError: string | null = null;
  constructor(private auth: AuthService, private userService: GymService, private alertController: AlertController, private gym:GymService) { }

  isCodeEntryVisible = false; // Controls visibility of the code entry
  verificationCode: string = ''; // Generated verification code
  codeBoxes = [0, 1, 2, 3]; // For 4 input boxes
  code: string[] = ['', '', '', ''];
  
  ngOnInit() {
    var gym_data =  this.auth.getGymData()    
    this.gym_data = gym_data
    this.gym.getGym(gym_data.gym_id).subscribe(res=>{
    
      try {
        
        this.gym_data['image'] = res[0]['image']
        this.gym_data['gym_name'] = res[0]['name']
        this.imageSrc = this.userService.bufferToBase64(gym_data.image['data']);    
        this.auth.setVariables(gym_data)
        gym_data =  this.auth.getGymData()
                
      } catch (error) {
        
      }
      
      
      
      
    })
    

    
  }

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

  async confirmPasswordChange() {
    const alert = await this.alertController.create({
      header: 'Confirm Password Change',
      message: 'Are you sure you want to change the password?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Password change canceled');
          },
        },
        {
          text: 'Confirm',
          handler: () => {
            this.saveData();
          },
        },
      ],
    });

    await alert.present();
  }
  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.isCodeEntryVisible = false;

  }

  confirm() {
    this.modal.dismiss(this.gym_data.name, 'confirm');
    this.isCodeEntryVisible = false;

  }

  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    this.isCodeEntryVisible = false;

    if (event.detail.role === 'confirm') {
      this.message = `Hello, ${event.detail.data}!`;
    }
  }
  saveData() {
    const formData = new FormData();
    formData.append('name', this.gym_data.gym_name); 
    formData.append('email', this.gym_data.email);
    formData.append('gym_id', this.auth.getGymData().gym_id.toString());
    formData.append('user_id', this.auth.getGymData().userId.toString());

    
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.gym.updateAdmin(formData)
   
  }


  validateNewPassword() {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(this.newpassword);
    const hasLowerCase = /[a-z]/.test(this.newpassword);
    const hasNumber = /\d/.test(this.newpassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(this.newpassword);

    if (this.newpassword.length < minLength) {
      this.passwordError = 'La contraseña debe tener al menos 8 caracteres.';
    } else if (!hasUpperCase) {
      this.passwordError = 'La contraseña debe incluir al menos una letra mayúscula.';
    } else if (!hasLowerCase) {
      this.passwordError = 'La contraseña debe incluir al menos una letra minúscula.';
    } else if (!hasNumber) {
      this.passwordError = 'La contraseña debe incluir al menos un número.';
    } else if (!hasSpecialChar) {
      this.passwordError = 'La contraseña debe incluir al menos un carácter especial.';
    } else {
      this.passwordError = null;
    }
  }
 
  validateConfirmPassword() {
    if (this.confirmnewpassword !== this.newpassword) {
      this.confirmError = 'Las contraseñas no coinciden.';
    } else {
      this.confirmError = null;
      
    }
  }

 
  generateVerificationCode(){
    this.gym.send_verification_codw().subscribe(response=>      
    {
      alert("codigo enviado")
      this.isCodeEntryVisible = true;
    }
    )
  }

  reset_password(){
    if(this.confirmError !== null) {
      alert("contraseña invalida")
    }
    this.modal.dismiss(null, 'cancel');

    const verificationCode = parseInt(this.code.join(''));
    this.gym.reset_password(verificationCode, this.newpassword).subscribe(res=>{
      
    })

    //this.isCodeEntryVisible = false;

  }

}
