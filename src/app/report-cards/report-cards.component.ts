
import { DataService } from '../data.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Athlete } from '../interfaces/athlete';
import { Level } from '../interfaces/level';
import { Event } from '../interfaces/event';
import { ReportCard } from '../interfaces/report-card';
import { ErrorApi } from '../interfaces/error-api';
import { ReportCardComponent } from '../interfaces/report-card-component';
import { MainNavComponent } from '../main-nav/main-nav.component';
import { AuthService } from '../auth/auth.service';
import { DialogService } from '../shared/dialog.service';
import { AthletesSelectComponent } from './athlete-select.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { PrintService } from '../print.service';

@Component({
  selector: 'app-report-cards',
  templateUrl: './report-cards.component.html',
  styleUrls: ['./report-cards.component.scss']
})
export class ReportCardsComponent implements OnInit {

  MAX_LEARNING_FOR_COMPLETED: number = 1;

  public level: Level;
  public selectedAthlete: Athlete;
  @ViewChild('athleteSelect') athleteSelect: AthletesSelectComponent; 

  comment: string;
  session: string = '';

  constructor(private data: DataService, public matDialog: MatDialog, 
    private mainNav: MainNavComponent, private auth: AuthService, 
    private dialog: DialogService, public printService: PrintService) { }

  ngOnInit() {  }


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
    const MAX_CHARACTERS = 250;
    if (this.comment.length > MAX_CHARACTERS) {
      this.dialog.openSnackBar('Comment too long. The message must be ' + MAX_CHARACTERS + ' characters or less. Yours currently is ' + this.comment.length + '.');
      return;
    }

    if(this.session === '') {
      this.dialog.openSnackBar('Please select a session before submitting report card.');
      return;
    }

    const dialogRef = this.matDialog.open(DayOfWeekDialog, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(dayOfWeek => {
      console.log('The dialog was closed');
      if(typeof dayOfWeek === 'undefined') {
        this.dialog.openSnackBar("Day of week must be selected in order to submit a report card.");
        return;
      }
      console.log(dayOfWeek);

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

      this.addReportCard(dayOfWeek);
    });
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

  addReportCard(dayOfWeek: string) {
    let reportCard = {} as ReportCard;
    reportCard.submitted_by = this.auth.user.id;
    reportCard.athletes_id = this.selectedAthlete.id;
    reportCard.levels_id = this.level.id;
    reportCard.comment = this.comment;
    reportCard.day_of_week = dayOfWeek;
    reportCard.session = this.session;
    reportCard.status = this.getReportCardStatus(reportCard);


    this.data.addReportCard(reportCard).subscribe(
      (data: ReportCard) => {
        console.log(data);
        this.addAllComponentsToReportCard(data);
        this.mainNav.reloadApprovalNeeded();
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

  getReportCardStatus(reportCard: ReportCard) {
    let learningCounter = 0;
    for(let e=0; e<this.level.events.length; e++) {
      const event = this.level.events[e];
      for(let s=0; s<event.skills.length; s++) {
        const skill = event.skills[s];
        console.log(skill.rank);
        if(skill.rank === 'LEARNING') {
          learningCounter++;
        }
      }
    }
    if(learningCounter > this.MAX_LEARNING_FOR_COMPLETED) {
      return "In Progress";
    } else {
      return "Completed";
    }
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

    this.athleteSelect.clearAthlete();
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

  sessionChanged(newSession: string) {
    this.session = newSession;
  }

  generateReportCard(athleteId: number) {
    console.log(athleteId);
    let reportCardData: string[] = [];
    reportCardData.push(athleteId.toString());
    this.printService.printDocument('report-card', reportCardData);
  }
}

@Component({
  selector: 'app-day-of-week-dialog',
  templateUrl: './day-of-week-dialog.html',
})
export class DayOfWeekDialog {

  constructor(public dialogRef: MatDialogRef<DayOfWeekDialog>) {
    console.log('TEST: Created I guess');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}