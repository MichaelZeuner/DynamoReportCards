import { Component, OnInit, Input, Inject, Output, EventEmitter, ViewChild } from '@angular/core';
import { ReportCard } from '../interfaces/report-card';
import { ReportCardCompleted, ReportCardComponentCompleted } from '../interfaces/report-card-completed';
import { DataService } from '../data.service';
import { DialogService } from '../shared/dialog.service';
import { MatDialog, MatExpansionPanel, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../auth/auth.service';
import { ReportCardsComponent } from '../report-cards/report-cards.component';
import { ErrorApi } from '../interfaces/error-api';
import { ReportCardComponent } from '../interfaces/report-card-component';
import { PrintService } from '../print.service';
import { ReportCardMod } from '../interfaces/report-card-mod';
import { ReportCardModComponent } from '../interfaces/report-card-mod-component';
import { Skill } from '../interfaces/skill';
import { Comments } from '../interfaces/comments';
import { Event } from '../interfaces/event';

interface ChangedComponents {
  id: number,
  report_cards_id: number,
  skills_id: number,
  rank: string
}

@Component({
  selector: 'app-report-card-panel',
  template: `
  <mat-expansion-panel #panel>
    <mat-expansion-panel-header>
    <mat-panel-title>
        {{reportCard.athlete.first_name}} {{reportCard.athlete.last_name}}
    </mat-panel-title>
    <mat-panel-description>
        {{reportCard.level.name}} Level {{reportCard.level.level_number}}
    </mat-panel-description>
    </mat-expansion-panel-header>

    <mat-list *ngFor="let event of reportCard.events">
        <mat-divider></mat-divider>

        <h3 class="eventTitle">{{event.name}}</h3>
        <div *ngFor="let component of reportCard.components">
            <mat-list-item *ngIf="component.skill.events_id == event.id">
                <span>{{component.skill.name}}</span>
                <span class="fill-remaining-space"></span>
                <mat-button-toggle-group #group="matButtonToggleGroup" value="{{component.rank}}" (click)="skillRankChanged(group.value, component.id)" name="skillAbility" aria-label="Skill Ability">
                    <mat-button-toggle value="LEARNING" class="btnToggle">Learning</mat-button-toggle>
                    <mat-button-toggle value="MASTERED" class="btnToggle">Mastered</mat-button-toggle>
                    <mat-button-toggle value="ASSISTED" class="btnToggle">Assisted</mat-button-toggle>
                </mat-button-toggle-group>
            </mat-list-item>
        </div>
    </mat-list>

    <mat-divider></mat-divider>
    <h4>Comments</h4>

      <mat-form-field class="w-100">
        <mat-label>Intro/Greeting</mat-label>
        <mat-select [(ngModel)]="selectedIntroComment" name="introComment">
          <mat-option [value]="-1">None</mat-option>
          <ng-container *ngFor="let commentActive of commentsActive">
            <mat-option *ngIf="commentActive.type === 'INTRO'" [value]="commentActive.id">{{commentActive.comment}}</mat-option>
          </ng-container>
          
        </mat-select>
      </mat-form-field>
      
      <mat-form-field  class="w-25">
        <mat-label>Event</mat-label>

        <mat-select (selectionChange)="eventChanged($event.value)" [(ngModel)]="selectedSkillCommentEvent" name="skillCommentEvent">
          <mat-option *ngFor="let event of events" [value]="event.id">{{event.name}}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field  class="w-75">
        <mat-label>Skill</mat-label>

        <mat-select (selectionChange)="skillChanged($event.value)" [disabled]="skills.length === 0" [(ngModel)]="selectedSkillCommentSkill" name="skillCommentSkill">
          <mat-option *ngFor="let skill of skills" [value]="skill.id">{{skill.name}}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field  class="w-100">
        <mat-label>Skill/Goal</mat-label>

        <mat-select [disabled]="skillsDisabled" [(ngModel)]="selectedSkillComment" name="skillComment">
          <mat-option [value]="-1">None</mat-option>
          <ng-container *ngFor="let commentActive of commentsActive">
            <mat-option *ngIf="commentActive.type === 'SKILL'" [value]="commentActive.id">{{commentActive.comment}}</mat-option>
          </ng-container>
        </mat-select>
      </mat-form-field>

      <mat-form-field  class="w-100">
        <mat-label>Closing</mat-label>
        <mat-select [(ngModel)]="selectedClosingComment" name="closingComment">
          <mat-option [value]="-1">None</mat-option>
          <ng-container *ngFor="let commentActive of commentsActive">
            <mat-option *ngIf="commentActive.type === 'CLOSING'" [value]="commentActive.id">{{commentActive.comment}}</mat-option>
          </ng-container>
        </mat-select>
      </mat-form-field>

    <p *ngIf="attemptsAtLevel >= ATTEMPTS_BEFORE_PASS" class="mb-0"><i>*The level has been attempted {{attemptsAtLevel}} times prior. The athlete should pass regardless of the number of skills still learning.*</i></p>
    <mat-button-toggle-group class="w-100 m-1" #groupStatus="matButtonToggleGroup"  [value]="attemptsAtLevel >= ATTEMPTS_BEFORE_PASS ? 'Completed' : reportCard.status" (click)="reportCardStatusChanged(groupStatus.value)" name="reportCardStatus" aria-label="Report Card Status">
        <mat-button-toggle value="In Progress" class="btnToggle w-50">In Progress</mat-button-toggle>
        <mat-button-toggle value="Completed" class="btnToggle w-50">Completed</mat-button-toggle>
    </mat-button-toggle-group>

    <div class="center">
        <button mat-raised-button color="primary" class="mr-1"
        (click)="generateReportCard(reportCard.athlete.id)">Preview Last Report Card</button>

        <button *ngIf="modifications === '' && changedComponents.length === 0" 
          mat-raised-button color="accent" class="mr-1"
          (click)="putReportCard()">Complete Report Card</button>
        <button *ngIf="modifications !== '' || changedComponents.length > 0" 
          mat-raised-button color="accent" class="mr-1" 
          (click)="submitReportCard()">Complete Report Card with Changes</button>
        <button *ngIf="modifications !== '' || changedComponents.length > 0" 
          mat-raised-button color="warn" class="mr-1"
          (click)="sendReportCardBack()">Send Report Card Back</button>
    </div>
        
  </mat-expansion-panel>
  `,
  styles: []
})
export class ReportCardPanelComponent implements OnInit {

  ATTEMPTS_BEFORE_PASS: number = 2;

  @ViewChild('panel') panel: MatExpansionPanel;
  @Input() reportCard: ReportCardCompleted;

  @Output() reportCardApprovedChanged = new EventEmitter<ReportCard>();
  changedComponents: ChangedComponents[] = [];
  
  modifications: string = '';
  panelOpenState: boolean;
  attemptsAtLevel: number = 0;

  public commentsBase: Comments[] = [];
  public commentsActive: Comments[] = [];
  
  public events: Event[] = [];
  selectedEvent: number;
  public skills: Skill[] = [];
  selectedSkill: number;

  selectedIntroComment: number;
  selectedSkillComment: number;
  selectedSkillCommentEvent: number;
  selectedSkillCommentSkill: number;
  selectedClosingComment: number;

  skillsDisabled: boolean;

  constructor(private data: DataService, public matDialog: MatDialog, 
    private auth: AuthService, private dialog: DialogService, 
    public printService: PrintService) { }

  ngOnInit() {
    this.selectedIntroComment = this.reportCard.card_comments.intro_comment_id;
    this.selectedSkillComment = this.reportCard.card_comments.skill_comment_id;
    this.selectedSkillCommentEvent = this.reportCard.card_comments.event_id;
    this.selectedSkillCommentSkill = this.reportCard.card_comments.skill_id;
    this.selectedClosingComment = this.reportCard.card_comments.closing_comment_id;

    console.log('report card in panel');
    console.log(this.reportCard);
    this.data.getAthletesAttemptsAtLevel(this.reportCard.athlete.id, this.reportCard.level.id).subscribe(
      (data: number) => { this.attemptsAtLevel = data; },
      (err: ErrorApi) => { console.error(err); }
    );

    this.data.getComments().subscribe(
      (data: Comments[]) => {
        //this slight hack of stringify followed by parse is a simiple deep copy
        this.commentsBase = JSON.parse(JSON.stringify(data));
        this.commentsActive = JSON.parse(JSON.stringify(data));
        console.log(this.commentsBase);

        this.data.getLevelEvents(this.reportCard.level.id).subscribe(
          (data: Event[]) => {
            this.events = data;
            this.eventChanged(this.reportCard.card_comments.event_id);
          }
        )
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

  updateComments() {
    let skillName: string, eventName: string;
    for(let i=0; i<this.events.length; i++) {
      if(this.events[i].id === this.selectedEvent) {
        eventName = this.events[i].name; 
        break;
      }
    }
 
    console.log('Selected Skill: ' + this.selectedSkill);
    for(let i=0; i<this.skills.length; i++) {
      if(this.skills[i].id === this.selectedSkill) {
       skillName = this.skills[i].name; 
       break;
      }
    }

    console.log(eventName);
    console.log(skillName);

    if(typeof skillName === 'undefined') {
      this.skillsDisabled = true;
      this.selectedSkillComment = -1;
    } else {
      this.skillsDisabled = false;
    }

    for(let i=0; i<this.commentsBase.length; i++) {
      this.commentsActive[i].comment = this.commentsBase[i].comment
        .replace('~!NAME!~', this.reportCard.athlete.first_name)
        .replace('~!EVENT!~', eventName.toLowerCase())
        .replace('~!SKILL!~', skillName.replace(/\(.*\)/g, '').toLowerCase());
    }
  }

  eventChanged(eventId: number) {
    this.selectedEvent = eventId;
    this.data.getEventSkills(this.reportCard.level.id, eventId).subscribe(
     (data: Skill[]) => {
       this.skills = data;
       console.log(data);
       this.skillChanged(this.reportCard.card_comments.skill_id);
     }
   )

  }

 skillChanged(skillId: number) {
   this.selectedSkill = skillId;
    this.updateComments();
 }

  openDialog(comment: string): void {
    console.log(comment);
    const dialogRef = this.matDialog.open(RequiredModificationsDialog, {
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

  sendReportCardBack() {
    if(this.modifications === '') {
      this.dialog.openSnackBar('A modification note is required before sending a report card back.');
      return;
    }

    this.dialog.openConfirmDialog('Are you sure you wish to send the report card back to the coach for modications?')
    .afterClosed().subscribe(res =>{
      if(res){
        let reportCardMod: ReportCardMod = {
          report_cards_id: this.reportCard.id,
          comment_modifications: this.modifications
        }
    
        this.data.addReportCardMod(reportCardMod).subscribe(
          (data: ReportCardMod) => {
            console.log('About to emit reportcard');
            this.reportCardApprovedChanged.emit(this.reportCard);
            
            console.log(data);
            for(let i=0; i<this.changedComponents.length; i++) {
              let reportCardModComponent: ReportCardModComponent = {
                report_cards_components_id: this.changedComponents[i].id,
                suggested_rank: this.changedComponents[i].rank
              }
              this.data.addReportCardModComponent(reportCardModComponent).subscribe(
                (componentData: ReportCardModComponent) => {
                  console.log(componentData);
                },
                (err: ErrorApi) => {
                  console.error(err.error.message);
                }
              )
            }
          },
          (err: ErrorApi) => {
            console.error(err.error.message);
          }
        )
      }
    });

    
  }

  submitReportCard() {
    console.log("submit report card");
    this.putReportCard();

    console.log("put changes");
    for(let i=0; i<this.changedComponents.length; i++) {
      const component = this.changedComponents[i];
      this.data.putReportCardComponent(component).subscribe(
        (data: ReportCardComponent) => { console.log(data); },
        (err: ErrorApi) => { console.error(err); }
      );
    }
  }

  putReportCard() {
    //FIXME: this should take in the comment number and select it in the correct drop downs
    if(this.modifications !== '') { /*this.reportCard.comment = this.modifications;*/ }

    this.reportCard.approved = this.auth.user.id;
    this.data.putReportCard(this.reportCard).subscribe(
      (data: ReportCard) => { 
        console.log(data); 
        this.dialog.openSnackBar("Report Card Approved!");

        console.log('About to emit reportcard');
        this.reportCardApprovedChanged.emit(this.reportCard);
      },
      (err: ErrorApi) => { console.error(err); }
    );
  }

  reportCardStatusChanged(newStatus: string) {
    this.reportCard.status = newStatus;
  } 

  skillRankChanged(newRank: string, id: number) {

    for(let x=0; x<this.reportCard.components.length; x++) {
      const component = this.reportCard.components[x];
      if(component.id === id) {
        if(this.removeComponentChangedIfNeeded(component, newRank)) { return; }
        if(this.addComponentChangedIfNeeded(component, newRank)) { return; }
      }
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

  generateReportCard(athleteId: number) {
    console.log(athleteId);
    let reportCardData: string[] = [];
    reportCardData.push(athleteId.toString());
    this.printService.printDocument('report-card', reportCardData);
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