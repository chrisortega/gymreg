import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth-service.service';
import { environment } from 'src/environments/environment.prod';


interface DataItem {
  id: number;
  day: string;
  gym_id: number;
  users_id: number;
  name: string;
}


@Injectable({
  providedIn: 'root'
})


export class GymService {
  private apiUrl = environment.gym_api_url; // Replace with your backend URL if hosted elsewhere
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${this.auth.getToken()}`,
  });

  constructor(private http: HttpClient, private auth: AuthService) {}

  // Get all gyms
  getGyms(): Observable<any> {
    const headers = this.headers
    return this.http.get(`${this.apiUrl}/gyms`, { headers });
  }

  // Get all gyms
  getGym(id:any): Observable<any> {
    const headers = this.headers
    return this.http.get(`${this.apiUrl}/gym/${id}`, { headers });
  }

  // Add a new gym
  addGym(gymName: string): Observable<any> {
    const headers = this.headers
    return this.http.post(`${this.apiUrl}/gyms`, { gym_name: gymName }, { headers });
  }

  // Get all users
  getUsers(): Observable<any> {
    const headers = this.headers
    return this.http.get(`${this.apiUrl}/users`, { headers });
  }
  getUsersByGym(): Observable<any> {
    const headers = this.headers
    var gymId = this.auth.getGymData()["gym_id"]
    return this.http.get(`${this.apiUrl}/users/gym/${gymId}`, { headers });
  }
  

  // Add a new user
  addUser(payload: {}): Observable<any> {
    const headers = this.headers
    return this.http.post(`${this.apiUrl}/users`, payload, {headers});
  }

  // Get all entries
  getEntries(): Observable<DataItem[]> {
    const headers = this.headers
    return this.http.get<DataItem[]>(`${this.apiUrl}/entries`,{headers});
  }

    // Get all entries from today
    getEntriesFromToday(gymId:string): Observable<any> {
      const headers = this.headers
      return this.http.get(`${this.apiUrl}/entries/today/${gymId}`, { headers });
    }

  // Add a new entry
  addEntry(userId: string, gym_id:number = 1): Observable<any> {
    const headers = this.headers
     gym_id = this.auth.getGymData().gym_id
    return this.http.post(`${this.apiUrl}/entries`,  { user_id: userId, gym_id:gym_id },{headers});
  }

  // Get all users
  getUser(id:string): Observable<any> {
    const headers = this.headers    
    return this.http.get(`${this.apiUrl}/users/${id}`,{headers});
  }

  getEntriesByUser(userId: string): Observable<any> {
    const headers = this.headers
    return this.http.get(`${this.apiUrl}/entries/${userId}`, { headers });
  }


    // save user
    saveUser(user: { id: string; name: string; exp: string }): Observable<any> {
      const headers = this.headers
      return this.http.put(`${this.apiUrl}/users`, user, { headers });
    }

    updateUserImage(userId: string, base64Image: string): Observable<any> {
      
      const url = `${this.apiUrl}/update-user-image/${userId}`;
  
      // Extract the MIME type and Base64 content
      const base64Parts = base64Image.split(',');
      const mimeType = base64Parts[0].match(/:(.*?);/)?.[1] || '';
      const base64Data = base64Parts[1];
  
      // Convert Base64 to Blob
      const byteCharacters = atob(base64Data);
      const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const imageBlob = new Blob([byteArray], { type: mimeType });
  
      const formData = new FormData();
      formData.append('image', imageBlob, 'image.jpg'); // You can rename 'image.jpg' if needed
  
      const headers = new HttpHeaders({
        // Add any additional headers if needed
      });
  
      return this.http.put(url, formData, { headers });
    }



  login(email:string, password:string): Observable<any> {
    
    return this.http.post(`${this.apiUrl}/login`, { email: email, password:password })
  }


  isExpired(expirationDate: string): boolean {    
    
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    return expirationDate < today; // Check if expiration date is in the past
  }

   bufferToBase64(buffer: ArrayBuffer): string {
    const byteArray = new Uint8Array(buffer);
    const base64String = btoa(String.fromCharCode.apply(null, Array.from(byteArray)));
    return base64String;
  }


  
  formDataToJson(formData: FormData): any {
    const json: any = {};
    formData.forEach((value, key) => {
      // If the value is a File, handle it appropriately (optional)

      if (value instanceof File){
        json[key] =   this.convertFileToBase64(value);
      }
      else {
        json[key] = value
      }
      
    });
    return json
    
    
  }

   convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file); // Reads the file as a Data URL (Base64 format)
  });
}


  updateAdmin(formData: FormData): void {    
    const headers = this.headers
    const url = `${this.apiUrl}/update-gym`;
    var json = this.formDataToJson(formData)
    json["image"].then((base64File: string) => {
      json['image'] = base64File
      return this.http.put(url, json, { headers }).subscribe();
    })
  }

  updateUser(formData: FormData): void {
  
    const headers = this.headers
    const url = `${this.apiUrl}/update-user`;
    var json = this.formDataToJson(formData)
    if ("image" in json){
      json["image"].then((base64File: string) => {
        json['image'] = base64File
         this.http.post(url, json, { headers }).subscribe();
      })
    }
    
    this.http.post(url, json, { headers }).subscribe();

  }
 
  send_verification_codw(): Observable<any> {
    var email = this.auth.getGymData()['email']
    var id = this.auth.getGymData()['userId']
    const headers = this.headers    
    return this.http.post(`${this.apiUrl}/send-password-code`, { email: email, id:id }, { headers })
  }

  reset_password(code:number, newpassword:string): Observable<any> {
    var email = this.auth.getGymData()['email']
    var id = this.auth.getGymData()['userId']
    const headers = this.headers    
    return this.http.post(`${this.apiUrl}/verify-code`, { email: email, id:id, code:code, newpassword:newpassword }, { headers })
  }





}
