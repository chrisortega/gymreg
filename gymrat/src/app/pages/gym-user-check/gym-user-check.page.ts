import { Component, OnInit } from '@angular/core';
import { GymService } from 'src/app/services/gym.service';

@Component({
  selector: 'app-gym-user-check',
  templateUrl: './gym-user-check.page.html',
  styleUrls: ['./gym-user-check.page.scss'],
})


export class GymUserCheckPage  {

  userId: string = ''; // To store the user ID input
  entries: any[] = []; // To store the entries fetched from the server
  errorMessage: string | null = null;
  user = {name:"", exp:"",gym_id:"" };
  constructor(private entryService: GymService) {}

  /**
   * Fetch entries for the entered user ID.
   */
  fetchEntries() {
    if (!this.userId) {
      this.errorMessage = 'Please enter a valid User ID.';
      return;
    }

    this.errorMessage = null;
    this.entryService.getEntriesByUser(this.userId).subscribe({
      next: (data) => {
        this.entries = data;
        this.user = data[0]
        if (data.length === 0) {
          this.errorMessage = 'No entries found for this user.';
        }
      },
      error: (err) => {
        console.error('Error fetching entries:', err);
        this.errorMessage = 'Failed to fetch entries. Please try again.';
      },
    });
  }

}
