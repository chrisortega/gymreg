import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { GymService } from 'src/app/services/gym.service';

@Component({
  selector: 'app-shared-header',
  templateUrl: './shared-header.component.html',
  styleUrls: ['./shared-header.component.scss'],
})
export class SharedHeaderComponent implements OnInit {
  currentDateTime: string = "";
  name: string = "GymAdmin"
  imageSrc: string | undefined;


  constructor(private auth:AuthService, private gymService:GymService){}
  
  ngOnInit() {
    var data = this.auth.getGymData()
    if (data){
    this.name = data.gym_name
    this.updateDateTime();
    setInterval(() => {
      this.updateDateTime();
    }, 1000);

    try {
      this.imageSrc = this.gymService.bufferToBase64(data.image['data']);    
    } catch (error) {
      
    }
  }
  }



  updateDateTime() {
    const now = new Date();
    this.currentDateTime = now.toLocaleString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
}
