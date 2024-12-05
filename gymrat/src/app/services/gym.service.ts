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

  // Add a new user
  addUser(name: string, gym_id:number = 1): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, { name, gym_id });
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


  login(email:string, password:string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email: email, password:password })
  }


  
}
