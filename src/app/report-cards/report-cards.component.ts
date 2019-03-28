
import { DataService } from '../data.service';
import { Component, OnInit } from '@angular/core';
import { Athlete } from '../interfaces/athlete';
import { Level } from '../interfaces/level';
import { Event } from '../interfaces/event';

@Component({
  selector: 'app-report-cards',
  templateUrl: './report-cards.component.html',
  styleUrls: ['./report-cards.component.scss']
})
export class ReportCardsComponent implements OnInit {

  public selectedLevel: Level;
  public selectedAthlete: Athlete;

  constructor(private data: DataService) { }

  ngOnInit() { }

  submitForApproval() {
    console.log("SUBMITTED");
  }

  updateSelectAthlete(newAthlete: Athlete) {
    console.log(newAthlete);
    this.selectedAthlete = newAthlete;
  }

  updateSelectLevel(newLevel: Level) {
    console.log(newLevel);
    this.selectedLevel = newLevel;
  }

  onEventsChange(events: Event[]) {
    console.log(events);
  }
}