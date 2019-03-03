import { Component, OnInit } from '@angular/core';
import { Level } from '../interfaces/level';
import { DataService } from '../data.service';

@Component({
  selector: 'app-approve-report-cards',
  templateUrl: './approve-report-cards.component.html',
  styleUrls: ['./approve-report-cards.component.scss']
})
export class ApproveReportCardsComponent implements OnInit {

  constructor(private data: DataService) { }

  levels: Level[];

  ngOnInit() {
    this.data.getLevels().subscribe((data : Level[]) => {
      console.log(data);

      this.levels = data;
      console.log(this.levels[0].name);
    });

  }

}
