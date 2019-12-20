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
import { ReportCardComments } from '../interfaces/report-card-comments';
import { CommonService } from '../shared/common.service';
import { MainNavComponent } from '../main-nav/main-nav.component';
import { User } from '../interfaces/user';

interface ChangedComponents {
	id: number;
	report_cards_id: number;
	skills_id: number;
	rank: string;
}

@Component({
	selector: 'app-report-card-panel',
	template: `
  <mat-expansion-panel #panel [expanded]="modifyOnly">
    <mat-expansion-panel-header>
    <mat-panel-title>
        {{reportCard.athlete.first_name}} {{reportCard.athlete.last_name}} ({{reportCard.athlete.date_of_birth}})
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
        <mat-select (selectionChange)="updateComments()" [disabled]="skills.length === 0" [(ngModel)]="selectedSkillCommentSkill" name="skillCommentSkill">
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

      <mat-form-field  class="w-25">
        <mat-label>Personality</mat-label>
        <mat-select [(ngModel)]="selectedPersonalityCategoryComment" name="personalityCategoryComment">
          <mat-option [value]="-1">None</mat-option>
          <ng-container *ngFor="let category of personalityCategories">
            <mat-option [value]="category">{{ category }}</mat-option>
          </ng-container>
        </mat-select>
      </mat-form-field>

      <mat-form-field  class="w-75">
        <mat-label>Personality</mat-label>
        <mat-select [(ngModel)]="selectedPersonalityComment" name="personalityComment">
          <mat-option [value]="-1">None</mat-option>
          <ng-container *ngFor="let commentActive of commentsActive">
            <mat-option *ngIf="
				commentActive.type ===
				('PERSONALITY_' + selectedPersonalityCategoryComment
				| uppercase)
			" [value]="commentActive.id">{{commentActive.comment}}</mat-option>
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

    <p *ngIf="attemptsAtLevel > ATTEMPTS_BEFORE_PASS" class="mb-0"><b><u><i><font color="red">*The level has been attempted {{attemptsAtLevel}} times prior. The athlete should pass regardless of the number of skills still learning.*</font></i></u></b></p>
    <mat-button-toggle-group class="w-100 m-1" #groupStatus="matButtonToggleGroup"  [value]="attemptsAtLevel >= ATTEMPTS_BEFORE_PASS ? 'Completed' : reportCard.status" (click)="reportCardStatusChanged(groupStatus.value)" name="reportCardStatus" aria-label="Report Card Status">
        <mat-button-toggle value="In Progress" class="btnToggle w-50">In Progress</mat-button-toggle>
        <mat-button-toggle value="Completed" class="btnToggle w-50">Completed</mat-button-toggle>
    </mat-button-toggle-group>

    <h4>Secondary Coach</h4>
	<app-user-select
		#secondaryCoachSelect
		[user]="reportCard.secondary_coach"
		(selectedUserChange)="updateSelectSecondaryCoach($event)"
	></app-user-select>

    <div class="center">
        <button mat-raised-button color="primary" class="mr-1" *ngIf="!modifyOnly"
        (click)="generateReportCard(reportCard.athlete.id, reportCard.level.level_groups_id)">Preview Last Report Card</button>

        <button *ngIf="generateUnmodifiedCommentIdString() === generateCurrentCommentIdString() && changedComponents.length === 0" 
          mat-raised-button color="accent" class="mr-1"
          (click)="putReportCard()">Complete Report Card</button>
        <button *ngIf="generateUnmodifiedCommentIdString() !== generateCurrentCommentIdString() || changedComponents.length > 0" 
          mat-raised-button color="accent" class="mr-1" 
          (click)="submitReportCard()">Complete Report Card with Changes</button>
        <button *ngIf="(generateUnmodifiedCommentIdString() !== generateCurrentCommentIdString() || changedComponents.length > 0) && !modifyOnly" 
          mat-raised-button color="warn" class="mr-1"
          (click)="sendReportCardBackPrepComments()">Send Report Card Back</button>
    </div>
        
  </mat-expansion-panel>
  `,
	styles: []
})
export class ReportCardPanelComponent implements OnInit {
	ATTEMPTS_BEFORE_PASS: number = 2;
	MAX_LEARNING_FOR_COMPLETED: number = 1;

	@ViewChild('panel') panel: MatExpansionPanel;
	@Input() reportCard: ReportCardCompleted;
	@Input() modifyOnly: Boolean = false;

	@Output() reportCardApprovedChanged = new EventEmitter<ReportCard>();
	changedComponents: ChangedComponents[] = [];

	panelOpenState: boolean;
	attemptsAtLevel: number = 0;

	public commentsBase: Comments[] = [];
	public commentsActive: Comments[] = [];

	personalityCategories: String[] = [
		"Brave",
		"Energy",
		"General",
		"Strength",
		"Social"
	  ];

	public events: Event[] = [];
	public skills: Skill[] = [];

	selectedIntroComment: number;
	selectedSkillComment: number;
	selectedSkillCommentEvent: number;
	selectedSkillCommentSkill: number;
	selectedPersonalityComment: number;
	selectedClosingComment: number;
	selectedPersonalityCategoryComment: String;

	skillsDisabled: boolean;

	constructor(
		private data: DataService,
		public matDialog: MatDialog,
		private auth: AuthService,
		private dialog: DialogService,
    public printService: PrintService,
    private comm: CommonService
	) {}

	generateCommentIdString(
		introComment: number,
		event: number,
		skill: number,
		skillComment: number,
		personalityComment: number,
		closingComment: number
	) {
		return introComment + '~' + event + '~' + skill + '~' + skillComment + '~' + personalityComment + '~' + closingComment;
	}

	generateUnmodifiedCommentIdString() {
		return this.generateCommentIdString(
			this.reportCard.card_comments.intro_comment_id,
			this.reportCard.card_comments.event_id,
			this.reportCard.card_comments.skill_id,
			this.reportCard.card_comments.skill_comment_id,
			this.reportCard.card_comments.personality_comment_id,
			this.reportCard.card_comments.closing_comment_id
		);
	}

	generateCurrentCommentIdString() {
		return this.generateCommentIdString(
			this.selectedIntroComment,
			this.selectedSkillCommentEvent,
			this.selectedSkillCommentSkill,
			this.selectedSkillComment,
			this.selectedPersonalityComment,
			this.selectedClosingComment
		);
	}

	getPersonalityCommentCategory(commentId: number) {
		for(let i=0; i<this.commentsBase.length; i++) {
			if(this.commentsBase[i].id === commentId) {
				let str = this.commentsBase[i].type.replace("PERSONALITY_", "");
				let firstLetter = str.substring(0,1);
				let remainging = str.substring(1, str.length).toLowerCase();
				return firstLetter + remainging;
			}
		}
		return "";
	}

	ngOnInit() {
		this.selectedIntroComment = this.reportCard.card_comments.intro_comment_id;
		this.selectedSkillComment = this.reportCard.card_comments.skill_comment_id;
		this.selectedSkillCommentEvent = this.reportCard.card_comments.event_id;
		this.selectedSkillCommentSkill = this.reportCard.card_comments.skill_id;
		this.selectedPersonalityComment = this.reportCard.card_comments.personality_comment_id;
		this.selectedClosingComment = this.reportCard.card_comments.closing_comment_id;

		console.log('report card in panel');
		console.log(this.reportCard);
		this.data.getAthletesAttemptsAtLevel(this.reportCard.athlete.id, this.reportCard.level.id).subscribe(
			(data: ReportCard[]) => {
				this.attemptsAtLevel = data.length;
			},
			(err: ErrorApi) => {
				console.error(err);
			}
		);

		this.data.getComments().subscribe(
			(data: Comments[]) => {
				//this slight hack of stringify followed by parse is a simiple deep copy
				this.commentsBase = JSON.parse(JSON.stringify(data));
				this.commentsActive = JSON.parse(JSON.stringify(data));

				this.selectedPersonalityCategoryComment = this.getPersonalityCommentCategory(this.reportCard.card_comments.personality_comment_id);
		
				this.data.getLevelEvents(this.reportCard.level.id).subscribe((data: Event[]) => {
					this.events = data;
					this.eventChanged(this.reportCard.card_comments.event_id);
				});
			},
			(err: ErrorApi) => {
				console.error(err);
				let message = 'Error Unknown...';
				if (err.error !== undefined) {
					message = err.error.message;
				}
				this.dialog.openSnackBar(message);
			}
		);
	}

	updateComments() {
		let skillName: string, eventName: string;
		for (let i = 0; i < this.events.length; i++) {
			if (this.events[i].id === this.selectedSkillCommentEvent) {
				eventName = this.events[i].name;
				break;
			}
		}

		for (let i = 0; i < this.skills.length; i++) {
			if (this.skills[i].id === this.selectedSkillCommentSkill) {
				skillName = this.skills[i].name;
				break;
			}
		}

		if (typeof skillName === 'undefined') {
			this.skillsDisabled = true;
			this.selectedSkillComment = -1;
			return;
		} else {
			this.skillsDisabled = false;
		}

		this.commentsActive = this.comm.updateComments(
			this.commentsBase,
			this.reportCard.level.id,
			this.reportCard.athlete.first_name,
			eventName,
			skillName
		  );
	}

	updateSelectSecondaryCoach(newSecondaryCoach: User) {
    if(newSecondaryCoach !== null) {
      this.reportCard.secondary_coach_id = newSecondaryCoach.id;
    }
	}

	eventChanged(eventId: number) {
		this.selectedSkillCommentEvent = eventId;
		this.data.getEventSkills(this.reportCard.level.id, eventId).subscribe((data: Skill[]) => {
			this.skills = data;
			console.log(data);
			this.updateComments();
		});
	}

	generateReportCurrentCardComment(): ReportCardComments {
		return {
			intro_comment_id: this.selectedIntroComment,
			event_id: this.selectedSkillCommentEvent,
			skill_id: this.selectedSkillCommentSkill,
			skill_comment_id: this.selectedSkillComment,
			personality_comment_id: this.selectedPersonalityComment,
			closing_comment_id: this.selectedClosingComment
		};
	}

	sendReportCardBackPrepComments() {
		if (this.generateCurrentCommentIdString().indexOf('-1') !== -1) {
			this.dialog.openSnackBar('All comment options must be selected!');
			return;
		}

		this.dialog
			.openConfirmDialog('Are you sure you wish to send the report card back to the coach for modications?')
			.afterClosed()
			.subscribe((res) => {
				if (res) {
					if (this.generateUnmodifiedCommentIdString() !== this.generateCurrentCommentIdString()) {
						let newComment: ReportCardComments = this.generateReportCurrentCardComment();
						this.data.addReportCardComment(newComment).subscribe(
							(data: ReportCardComments) => {
								this.sendReportCardBack(data.id);
							},
							(err: ErrorApi) => {
								console.error(err.error.message);
								this.dialog.openSnackBar(err.error.message);
							}
						);
					} else {
						this.sendReportCardBack(this.reportCard.comment);
					}
				}
			});
	}

	sendReportCardBack(commentModId: number) {
		let reportCardMod: ReportCardMod = {
			report_cards_id: this.reportCard.id,
			comment_modifications: commentModId
		};

		this.data.addReportCardMod(reportCardMod).subscribe(
			(data: ReportCardMod) => {
				console.log('About to emit reportcard');
				this.reportCardApprovedChanged.emit(this.reportCard);

				console.log(data);
				for (let i = 0; i < this.changedComponents.length; i++) {
					let reportCardModComponent: ReportCardModComponent = {
						report_cards_components_id: this.changedComponents[i].id,
						suggested_rank: this.changedComponents[i].rank
					};
					this.data.addReportCardModComponent(reportCardModComponent).subscribe(
						(componentData: ReportCardModComponent) => {
							console.log(componentData);
						},
						(err: ErrorApi) => {
							console.error(err.error.message);
						}
					);
				}
			},
			(err: ErrorApi) => {
				console.error(err.error.message);
			}
		);
	}

	submitReportCard() {
		console.log('submit report card');
		this.putReportCard();

		console.log('put changes');
		for (let i = 0; i < this.changedComponents.length; i++) {
			const component = this.changedComponents[i];
			this.data.putReportCardComponent(component).subscribe(
				(data: ReportCardComponent) => {
					console.log(data);
				},
				(err: ErrorApi) => {
					console.error(err);
				}
			);
		}
	}

	putReportCard() {
		if (this.generateUnmodifiedCommentIdString() !== this.generateCurrentCommentIdString()) {
			if (this.generateUnmodifiedCommentIdString() !== this.generateCurrentCommentIdString()) {
				let newComment: ReportCardComments = this.generateReportCurrentCardComment();
				this.data.addReportCardComment(newComment).subscribe(
					(data: ReportCardComments) => {
						this.reportCard.comment = data.id;
					},
					(err: ErrorApi) => {
						console.error(err.error.message);
						this.dialog.openSnackBar(err.error.message);
					}
				);
			}
		}

    this.reportCard.approved = this.auth.user.id;
    console.log("Report Card", this.reportCard);
		this.data.putReportCard(this.reportCard).subscribe(
			(data: ReportCard) => {
				console.log(data);
				this.dialog.openSnackBar('Report Card Approved!');

				console.log('About to emit reportcard');
				this.reportCardApprovedChanged.emit(this.reportCard);
			},
			(err: ErrorApi) => {
				console.error(err);
			}
		);
	}

	reportCardStatusChanged(newStatus: string) {
		this.reportCard.status = newStatus;
	}

	skillRankChanged(newRank: string, id: number) {
		for (let x = 0; x < this.reportCard.components.length; x++) {
			const component = this.reportCard.components[x];
			if (component.id === id) {
				if (this.removeOrUpdateComponentChangedIfNeeded(component, newRank)) {
					this.countSkillsLearning();
					return;
				}
				if (this.addComponentChangedIfNeeded(component, newRank)) {
					this.countSkillsLearning();
					return;
				}
			}
		}
	}

	countSkillsLearning() {
		let numberOfSkillsLearning: number = 0;
		let isChanged: boolean = false;
		for(let i=0; i<this.reportCard.components.length; i++) {
			isChanged = false;
			for(let x=0; x<this.changedComponents.length; x++) {
				if(this.reportCard.components[i].id === this.changedComponents[x].id) {
					isChanged = true;
					if(this.changedComponents[x].rank === this.comm.SKILL_RANK_LEARNING) {
						numberOfSkillsLearning++;
					}
					break;
				}
			}

			if(isChanged === false) {
				if(this.reportCard.components[i].rank === this.comm.SKILL_RANK_LEARNING) {
					numberOfSkillsLearning++;
				}
			}
		}

		if(numberOfSkillsLearning > this.comm.MAX_LEARNING_FOR_COMPLETED) {
			this.reportCard.status = this.comm.STATUS_IN_PROGRESS;
		} else {
			this.reportCard.status = this.comm.STATUS_COMPLETED;
		}
	}

	removeOrUpdateComponentChangedIfNeeded(component: ReportCardComponentCompleted, newRank: string): boolean {
		for (let y = 0; y < this.changedComponents.length; y++) {
			const changedComponent = this.changedComponents[y];
			if (changedComponent.id === component.id) {
				if (component.rank === newRank) {
					this.changedComponents.splice(y, 1);
					return true;
				} else {
					this.changedComponents[y].rank = newRank;
				}
			}
		}
		return false;
	}

	addComponentChangedIfNeeded(component: ReportCardComponentCompleted, newRank: string): boolean {
		if (component.rank !== newRank) {
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

	generateReportCard(athleteId: number, levelGroupdId: number) {
		console.log('level group id: ', levelGroupdId);
		let reportCardData: string[] = [];
		reportCardData.push(athleteId.toString());
		reportCardData.push(levelGroupdId.toString());
		this.printService.printDocument('report-card', reportCardData);
	}
}
