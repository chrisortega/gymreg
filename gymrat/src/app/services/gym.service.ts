import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth-service.service';
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
  private apiUrl = 'http://localhost:3000'; // Replace with your backend URL if hosted elsewhere
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${this.auth.getToken()}`,
  });

  constructor(private http: HttpClient, private auth: AuthService) {}

  // Get all gyms
  getGyms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/gyms`);
  }

  // Get all gyms
  getGym(id:any): Observable<any> {
    return this.http.get(`${this.apiUrl}/gym/${id}`);
  }

  // Add a new gym
  addGym(gymName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/gyms`, { gym_name: gymName });
  }

  // Get all users
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }
  getUsersByGym(): Observable<any> {
    var gymId = this.auth.getGymData()["gym_id"]
    return this.http.get(`${this.apiUrl}/users/gym/${gymId}`);
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
    getEntriesFromToday(): Observable<any> {
      return this.http.get(`${this.apiUrl}/entries/today`);
    }

  // Add a new entry
  addEntry(userId: string, gym_id:number = 1): Observable<any> {
    const headers = this.headers
    gym_id = this.auth.getGymData()["gym_id"]
    return this.http.post(`${this.apiUrl}/entries`,  { user_id: userId, gym_id:gym_id },{headers});
  }

  // Get all users
  getUser(id:string): Observable<any> {
    const headers = this.headers
    
    return this.http.get(`${this.apiUrl}/users/${id}`,{headers});
  }

  getEntriesByUser(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/entries/${userId}`);
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


  updateUser(formData: FormData): Observable<any> {
    const url = `${this.apiUrl}/update-user`;
    return this.http.put(url, formData);
  }
  
}
