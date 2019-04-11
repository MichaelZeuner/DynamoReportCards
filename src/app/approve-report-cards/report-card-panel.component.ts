import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { ReportCard } from '../interfaces/report-card';
import { ReportCardCompleted, ReportCardComponentCompleted } from '../interfaces/report-card-completed';
import { DataService } from '../data.service';
import { DialogService } from '../shared/dialog.service';
import { MatDialog, MatExpansionPanel, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../auth/auth.service';
import { ReportCardsComponent } from '../report-cards/report-cards.component';
import { ErrorApi } from '../interfaces/error-api';

interface ChangedComponents {
  id: number,
  report_cards_id: number,
  skills_id: number,
  rank: string
}

@Component({
  selector: 'app-report-card-panel',
  template: `
  <mat-expansion-panel>
    <mat-expansion-panel-header>
    <mat-panel-title>
        {{reportCard.athlete.first_name}} {{reportCard.athlete.last_name}}
    </mat-panel-title>
    <mat-panel-description>
        {{reportCard.level.name}}
    </mat-panel-description>
    </mat-expansion-panel-header>

    <mat-list *ngFor="let event of reportCard.events">
        <mat-divider></mat-divider>

        <h3 class="eventTitle">{{event.name}}</h3>
        <div *ngFor="let component of reportCard.components">
            <mat-list-item *ngIf="component.skill.events_id == event.id">
                <span>{{component.skill.name}}</span>
                <span class="fill-remaining-space"></span>
                <mat-button-toggle-group #group="matButtonToggleGroup" value="{{component.rank}}" (click)="skillRankChanged(group.value)" name="skillAbility" aria-label="Skill Ability">
                    <mat-button-toggle value="LEARNING" class="btnToggle">Learning</mat-button-toggle>
                    <mat-button-toggle value="MASTERED" class="btnToggle">Mastered</mat-button-toggle>
                </mat-button-toggle-group>
            </mat-list-item>
        </div>
    </mat-list>

    <mat-divider></mat-divider>
    <h3>Comment</h3>
    <p>{{reportCard.comment}}</p>
    <div class='display: float;'>
        <span class="fill-remaining-space"></span>
        <button mat-raised-button (click)="openDialog(reportCard.comment)">Modification Required</button>
    </div>
    

    <p *ngIf="modifications !== ''"><i>{{modifications}}</i></p>

    <div class="center">
        <button *ngIf="modifications === '' && changedComponents.length === 0" 
          mat-raised-button color="accent" class="mr-1">Complete Report Card</button>
        <button *ngIf="modifications !== '' || changedComponents.length > 0" 
          mat-raised-button color="accent" class="mr-1" 
          (click)="submitReportCard()">Complete Report Card with Changes</button>
        <button *ngIf="modifications !== '' || changedComponents.length > 0" 
          mat-raised-button color="warn" disabled class="mr-1">Send Report Card Back</button>
    </div>
        
  </mat-expansion-panel>
  `,
  styles: []
})
export class ReportCardPanelComponent implements OnInit {

  @Input() reportCard: ReportCardCompleted;

  changedComponents: ChangedComponents[] = [];
  
  modifications: string = '';
  panelOpenState: boolean;

  constructor(private data: DataService, public dialog: MatDialog, private auth: AuthService) { }

  ngOnInit() {
    console.log('report card in panel');
    console.log(this.reportCard);
  }

  openDialog(comment: string): void {
    console.log(comment);
    const dialogRef = this.dialog.open(RequiredModificationsDialog, {
      width: '500px',
      data: { comment: comment, modifications: this.modifications }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(typeof result === 'undefined') {
        result = '';
      }
      this.modifications = result;
      console.log('new comment:' + this.modifications);
    });
  }

  submitReportCard() {
    this.reportCard.approved = this.auth.user.id;
    console.log(this.reportCard);
    this.data.putReportCard(this.reportCard).subscribe(data => {
      console.log(data);
    },
    (err: ErrorApi) => {
      console.error(err);
    });

    for(let i=0; i<this.changedComponents.length; i++) {
      //SUBMIT REPORT CARD COMPONENT
    }
    console.log(this.changedComponents);
  }

  skillRankChanged(newRank: string) {

    for(let x=0; x<this.reportCard.components.length; x++) {
      const component = this.reportCard.components[x];
      if(this.removeComponentChangedIfNeeded(component, newRank)) { return; }
      if(this.addComponentChangedIfNeeded(component, newRank)) { return; }
    }
  } 

  removeComponentChangedIfNeeded(component: ReportCardComponentCompleted, newRank: string): boolean {
    for(let y=0; y<this.changedComponents.length; y++) {
      const changedComponent = this.changedComponents[y];
      if(changedComponent.id === component.id) {
        if(component.rank === newRank) {
          this.changedComponents.splice(y, 1);
          return true;
        }
      }
    }
    return false;
  }

  addComponentChangedIfNeeded(component: ReportCardComponentCompleted, newRank: string): boolean {
    if(component.rank !== newRank) {
      this.changedComponents.push({
        skills_id: component.skills_id, 
        rank: newRank,
        report_cards_id: this.reportCard.id,
        id: component.id
      });
      return true;
    }
    return false;
  }

}

export interface DialogData {
  comment: string;
  modifications: string;
}

@Component({
  selector: 'app-required-modifications-dialog',
  templateUrl: './required-modifications-dialog.html',
})
export class RequiredModificationsDialog {

  constructor(
    public dialogRef: MatDialogRef<RequiredModificationsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    console.log('TEST: ' + data.comment);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-required-modifications-dialog',
  template: `
    <div mat-dialog-content>
      <p>You are about to close a report card with unsaved changed. Doing so will r</p>
      <mat-form-field class="w-100">
          <textarea matInput rows="10" placeholder="Enter modification notes" [(ngModel)]="data.modifications"></textarea>
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-raised-button color="warn" (click)="onNoClick()">Clear Comments</button>
      <button mat-raised-button color="accent" [mat-dialog-close]="data.modifications" cdkFocusInitial>Submit Comments</button>
    </div>
  `,
})
export class CloseReportCardDialog {

  constructor(public dialogRef: MatDialogRef<CloseReportCardDialog>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}