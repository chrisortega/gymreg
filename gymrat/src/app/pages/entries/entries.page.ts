import { Component, OnInit } from '@angular/core';
import { GymService } from 'src/app/services/gym.service';

interface DataItem {
  id: number;
  day: string;
  gym_id: number;
  users_id: number;
  name: string;
}

@Component({
  selector: 'app-entries',
  templateUrl: './entries.page.html',
  styleUrls: ['./entries.page.scss'],
})


export class EntriesPage implements OnInit {


  constructor(private gymService:GymService) { }


  data: DataItem[] = [];
  filteredData: DataItem[] = [];
  filterDate: string = '';
  ngOnInit() {
    this.gymService.getEntries().subscribe(data=>{
      this.filteredData = data
      this.data = data
      
    })
  }

  filterData() {
    if (this.filterDate) {
      this.filterDate = this.filterDate.toString().split("T")[0]
      // Filter only by date part (YYYY-MM-DD)
      console.log(this.filterDate)
      this.filteredData = this.data.filter((item) => {
        return item.day.split("T")[0].startsWith(this.filterDate);
      });
      console.log(this.filteredData)
    } else {
      this.filteredData = this.data; // Reset to full data if no filter
    }
  }



}
