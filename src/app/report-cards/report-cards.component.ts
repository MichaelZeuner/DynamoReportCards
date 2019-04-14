
import { DataService } from '../data.service';
import { Component, OnInit } from '@angular/core';
import { Athlete } from '../interfaces/athlete';
import { Level } from '../interfaces/level';
import { Event } from '../interfaces/event';
import { ReportCard } from '../interfaces/report-card';
import { ErrorApi } from '../interfaces/error-api';
import { ReportCardComponent } from '../interfaces/report-card-component';
import { MainNavComponent } from '../main-nav/main-nav.component';
import { AuthService } from '../auth/auth.service';
import { DialogService } from '../shared/dialog.service';

@Component({
  selector: 'app-report-cards',
  templateUrl: './report-cards.component.html',
  styleUrls: ['./report-cards.component.scss']
})
export class ReportCardsComponent implements OnInit {

  public level: Level;
  public selectedAthlete: Athlete;
  
  comment: string;

  constructor(private data: DataService, private mainNav: MainNavComponent, private auth: AuthService, private dialog: DialogService) { }

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
    this.level = newLevel;
  }

  onEventsChange(events: Event[]) {
    this.level.events = events;
    console.log(this.level);
  }

  submitClick() {
    console.log(this.comment);
    if(typeof this.comment === 'undefined' || this.comment.length === 0) {
      this.dialog.openSnackBar('Comment required!');
      return;
    }

    if(typeof this.level.events === 'undefined') {
      this.dialog.openSnackBar('Please select a ranking for all skills.');
      return;
    }

    
    let errors = this.getErrors();
    if(errors.length > 0) {
      let error: string = `Please select rankings for the following: ${errors[0]}`;
      for(let i=1; i<errors.length; i++) {
        error += (i === errors.length-1) ? ', and ' : ', ';
        error += errors[i];
      }
      this.dialog.openSnackBar(error, errors.length * 1000);
      return;
    }

    this.addReportCard();
    this.mainNav.reloadApprovalNeeded();
  }

  getErrors(): string[] {
    let errors: string[] = [];
    for(let e=0; e<this.level.events.length; e++) {
      const event = this.level.events[e];

      if(typeof event.skills === 'undefined') {
        errors.push(`all the skills in ${event.name}`);
        continue;
      }

      for(let s=0; s<event.skills.length; s++) {
        const skill = event.skills[s];
        if(typeof skill.rank === 'undefined') {
          errors.push(`${skill.name} in ${event.name}`);
        }
      }
    }
    return errors;
  }

  addReportCard() {
    let reportCard = {} as ReportCard;
    reportCard.submitted_by = this.auth.user.id;
    reportCard.athletes_id = this.selectedAthlete.id;
    reportCard.levels_id = this.level.id;
    reportCard.comment = this.comment;
    this.data.addReportCard(reportCard).subscribe(
      (data: ReportCard) => {
        console.log(data);
        this.addAllComponentsToReportCard(data);
      },
      (err: ErrorApi) => {
        console.error(err);
        let message = 'Error Unknown...';
        if(err.error !== undefined) {
          message = err.error.message;
        }
        this.dialog.openSnackBar(message)
      }
    );
  }

  addAllComponentsToReportCard(reportCard: ReportCard) {
    for(let e=0; e<this.level.events.length; e++) {
      const event = this.level.events[e];
      for(let s=0; s<event.skills.length; s++) {
        const skill = event.skills[s];
        let reportCardComponent = {} as ReportCardComponent;
        reportCardComponent.report_cards_id = reportCard.id;
        reportCardComponent.skills_id = skill.id;
        reportCardComponent.rank = skill.rank;
        this.addComponentToReportCard(reportCardComponent);
      }
    }

    this.dialog.openSnackBar('Report card has been submitted for approval!');
  }

  addComponentToReportCard(reportCardComponent: ReportCardComponent) {
    this.data.addReportCardComponent(reportCardComponent).subscribe(
      (data: ReportCardComponent) => {
        console.log(data);
      },
      (err: ErrorApi) => {
        console.error(err);
        let message = 'Error Unknown...';
        if(err.error !== undefined) {
          message = err.error.message;
        }
        this.dialog.openSnackBar(message);
      }
    );
  }
}