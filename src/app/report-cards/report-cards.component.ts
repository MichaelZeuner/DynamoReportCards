import { DataService } from "../data.service";
import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { Athlete } from "../interfaces/athlete";
import { Level } from "../interfaces/level";
import { Event } from "../interfaces/event";
import { ReportCard } from "../interfaces/report-card";
import { ErrorApi } from "../interfaces/error-api";
import { ReportCardComponent } from "../interfaces/report-card-component";
import { MainNavComponent } from "../main-nav/main-nav.component";
import { AuthService } from "../auth/auth.service";
import { DialogService } from "../shared/dialog.service";
import { AthletesSelectComponent } from "./athlete-select.component";
import {
  MatDialogRef,
  MatDialog,
  MatSelect,
  MAT_DIALOG_DATA
} from "@angular/material";
import { PrintService } from "../print.service";
import { Comments } from "../interfaces/comments";
import { ReportCardComments } from "../interfaces/report-card-comments";
import { Skill } from "../interfaces/skill";
import { CommonService } from "../shared/common.service";
import { ReportCardCompleted } from "../interfaces/report-card-completed";
import { SelectDialogInput } from "../mat-select-dialog/select-dialog-input";
import { SelectDialogOutput } from "../mat-select-dialog/select-dialog-output";

@Component({
  selector: "app-report-cards",
  templateUrl: "./report-cards.component.html",
  styleUrls: ["./report-cards.component.scss"]
})
export class ReportCardsComponent implements OnInit {
  UNSELECTED: number = -1;
  MAX_LEARNING_FOR_COMPLETED: number = 1;

  public level: Level;
  public selectedAthlete: Athlete;
  public skillName: string;
  public eventName: string;
  @ViewChild("athleteSelect") athleteSelect: AthletesSelectComponent;

  public commentsBase: Comments[] = [];
  public commentsPreviousRemoved: Comments[] = [];
  public commentsActive: Comments[] = [];

  public events: Event[] = [];
  selectedEvent: number;
  public skills: Skill[] = [];
  selectedSkill: number;
  public skillsDisabled: Boolean = true;

  newReportCard: boolean = true;
  partialReportCard: ReportCard = null;

  selectedIntroComment: number = this.UNSELECTED;
  selectedSkillComment: number = this.UNSELECTED;
  selectedClosingComment: number = this.UNSELECTED;

  constructor(
    private data: DataService,
    public matDialog: MatDialog,
    private mainNav: MainNavComponent,
    private auth: AuthService,
    private dialog: DialogService,
    public printService: PrintService,
    private comm: CommonService
  ) {}

  ngOnInit() {
    this.data.getComments().subscribe(
      (data: Comments[]) => {
        this.commentsBase = this.comm.deepCopy(data);
        console.log(this.commentsBase);
      },
      (err: ErrorApi) => {
        console.error(err);
        let message = "Error Unknown...";
        if (err.error !== undefined) {
          message = err.error.message;
        }
        this.dialog.openSnackBar(message);
      }
    );

    this.data.getCoachesInProgressReportCard().subscribe(
      (partialReportCards: ReportCardCompleted[]) => {
        console.log(partialReportCards);

        let reportCardSelectInput: SelectDialogInput = {
          label: "Select a Partialy Created Report Card to Continue",
          options: [{ id: -1, value: "Create New Report Card" }]
        };
        for (let i = 0; i < partialReportCards.length; i++) {
          reportCardSelectInput.options.push({
            id: partialReportCards[i].id,
            value:
              partialReportCards[i].athlete.first_name +
              " " +
              partialReportCards[i].athlete.last_name +
              " - " +
              partialReportCards[i].level.name +
              " Level " +
              partialReportCards[i].level.level_number
          });
        }
        this.dialog
          .openSelectDialog(reportCardSelectInput)
          .afterClosed()
          .subscribe(res => {
            console.log(res);
            if (res) {
              let result: SelectDialogOutput = res;
              if (result.id !== -1) {
                console.log(result.id);
                console.log(result.value);

                for (let i = 0; i < partialReportCards.length; i++) {
                  if (partialReportCards[i].id === result.id) {
                    this.updatePartialReportCard(partialReportCards[i]);
                  }
                }
              }
            }
          });
      },
      (err: ErrorApi) => {
        console.error(err);
      }
    );
  }

  updatePartialReportCard(partialReportCard: ReportCardCompleted) {
    this.level = partialReportCard.level;
    this.level.events = partialReportCard.events;
    for (let x = 0; x < this.level.events.length; x++) {
      let event = this.level.events[x];

      this.level.events[x].skills = [];
      for (let y = 0; y < partialReportCard.components.length; y++) {
        let component: any = partialReportCard.components[y];
        if (event.id === component.skill.events_id) {
          let skill = component.skill;
          this.level.events[x].skills.push({
            id: skill.id,
            name: skill.name,
            rank: component.rank
          });
        }
      }
    }

    this.selectedAthlete = partialReportCard.athlete;
    this.partialReportCard = partialReportCard;
    this.newReportCard = false;
  }

  eventChanged(eventId: number) {
    this.selectedEvent = eventId;
    this.data
      .getEventSkills(this.level.id, eventId)
      .subscribe((data: Skill[]) => {
        this.skills = data;
      });
  }

  skillChanged(skillId: number) {
    this.selectedSkill = skillId;
    this.skillsDisabled = false;

    for (let i = 0; i < this.events.length; i++) {
      if (this.events[i].id === this.selectedEvent) {
        this.eventName = this.events[i].name;
        break;
      }
    }

    for (let i = 0; i < this.skills.length; i++) {
      if (this.skills[i].id === skillId) {
        this.skillName = this.skills[i].name;
        break;
      }
    }

    this.updateComments();
  }

  submitForApproval() {
    console.log("SUBMITTED");
  }

  updateSelectAthlete(newAthlete: Athlete) {
    this.selectedAthlete = newAthlete;
  }

  updateComments() {
    this.commentsActive = this.comm.updateComments(
      this.commentsPreviousRemoved,
      this.level.id,
      this.selectedAthlete.first_name,
      this.eventName,
      this.skillName
    );
  }

  updateSelectLevel(newLevel: Level) {
    this.level = newLevel;

    let levelId: number = this.level === null ? -1 : this.level.id;
    this.partialReportCard = {
      submitted_by: this.auth.user.id,
      athletes_id: this.selectedAthlete.id,
      levels_id: levelId,
      comment: 0,
      day_of_week: "UNSET",
      session: "UNSET",
      status: "Partial"
    };

    if (this.level !== null) {
      this.data
        .getAthletesAttemptsAtLevel(this.selectedAthlete.id, levelId)
        .subscribe(
          (previousReportCards: ReportCardCompleted[]) => {
            console.log(previousReportCards);
            console.log(this.commentsBase);
            this.commentsPreviousRemoved = this.comm.deepCopy(
              this.commentsBase
            );
            for (let i = this.commentsPreviousRemoved.length - 1; i >= 0; i--) {
              for (let x = 0; x < previousReportCards.length; x++) {
                if (
                  this.commentsPreviousRemoved[i].id ===
                    previousReportCards[x].card_comments.intro_comment_id ||
                  this.commentsPreviousRemoved[i].id ===
                    previousReportCards[x].card_comments.skill_comment_id ||
                  this.commentsPreviousRemoved[i].id ===
                    previousReportCards[x].card_comments.closing_comment_id
                ) {
                  this.commentsPreviousRemoved.splice(i, 1);
                  break;
                }
              }
            }
            console.log(this.commentsPreviousRemoved);
            this.updateComments();
          },
          (err: ErrorApi) => {
            console.error(err);
          }
        );

      this.data.getLevelEvents(levelId).subscribe((data: Event[]) => {
        this.events = data;
      });
    }
  }

  onEventsChange(events: Event[]) {
    if (typeof this.level.events !== "undefined") {
      for (let i = 0; i < this.level.events.length; i++) {
        if (typeof this.level.events[i].skills !== "undefined") {
          this.newReportCard = false;
        }
      }
    }

    if (this.newReportCard) {
      this.newReportCard = false;
      this.data.addReportCard(this.partialReportCard).subscribe(
        (data: ReportCard) => {
          console.log(data);
          this.partialReportCard = data;
          this.addAllComponentsToReportCard(this.partialReportCard);
        },
        (err: ErrorApi) => {
          console.error(err);
          this.dialog.openSnackBar(err.message);
        }
      );
    } else {
      console.log(this.partialReportCard);
      this.addAllComponentsToReportCard(this.partialReportCard);
    }

    this.level.events = events;
    console.log(this.level);
  }

  submitClick() {
    if (this.selectedIntroComment === this.UNSELECTED) {
      this.dialog.openSnackBar("Intro comment required!");
      return;
    }

    if (this.selectedSkillComment === this.UNSELECTED) {
      this.dialog.openSnackBar("Skill/Goal comment required!");
      return;
    }

    if (this.selectedClosingComment === this.UNSELECTED) {
      this.dialog.openSnackBar("Closing comment required!");
      return;
    }

    if (this.partialReportCard.session === "") {
      this.dialog.openSnackBar(
        "Please select a session before submitting report card."
      );
      return;
    }

    const dialogRef = this.matDialog.open(DayOfWeekDialog, {
      width: "400px"
    });

    dialogRef.afterClosed().subscribe(dayOfWeek => {
      console.log("The dialog was closed");
      if (typeof dayOfWeek === "undefined") {
        this.dialog.openSnackBar(
          "Day of week must be selected in order to submit a report card."
        );
        return;
      }
      console.log(dayOfWeek);

      if (typeof this.level.events === "undefined") {
        this.dialog.openSnackBar("Please select a ranking for all skills.");
        return;
      }

      let errors = this.getErrors();
      if (errors.length > 0) {
        let error: string = `Please select rankings for the following: ${errors[0]}`;
        for (let i = 1; i < errors.length; i++) {
          error += i === errors.length - 1 ? ", and " : ", ";
          error += errors[i];
        }
        this.dialog.openSnackBar(error, errors.length * 1000);
        return;
      }

      this.addReportCardComment(dayOfWeek);
    });
  }

  getErrors(): string[] {
    let errors: string[] = [];
    for (let e = 0; e < this.level.events.length; e++) {
      const event = this.level.events[e];

      if (typeof event.skills === "undefined") {
        errors.push(`all the skills in ${event.name}`);
        continue;
      }

      for (let s = 0; s < event.skills.length; s++) {
        const skill = event.skills[s];
        if (typeof skill.rank === "undefined") {
          errors.push(`${skill.name} in ${event.name}`);
        }
      }
    }
    return errors;
  }

  addReportCardComment(dayOfWeek: string) {
    let comment: ReportCardComments = {
      intro_comment_id: this.selectedIntroComment,
      skill_comment_id: this.selectedSkillComment,
      event_id: this.selectedEvent,
      skill_id: this.selectedSkill,
      closing_comment_id: this.selectedClosingComment
    };

    let addedReportCardComment: ReportCardComments;
    this.data.addReportCardComment(comment).subscribe(
      (data: ReportCardComments) => {
        addedReportCardComment = data;
        this.addReportCard(dayOfWeek, addedReportCardComment);
      },
      (err: ErrorApi) => {
        console.error(err);
        let message = "Error Unknown...";
        if (err.error !== undefined) {
          message = err.error.message;
        }
        this.dialog.openSnackBar(message);
        return;
      }
    );
  }

  addReportCard(dayOfWeek: string, addedReportCardComment: ReportCardComments) {
    this.partialReportCard.comment = addedReportCardComment.id;
    this.partialReportCard.day_of_week = dayOfWeek;
    this.partialReportCard.status = this.getReportCardStatus(
      this.partialReportCard
    );

    this.addPutReportCard();

    this.athleteSelect.clearAthlete();
    this.dialog.openSnackBar("Report card has been submitted for approval!");
    this.mainNav.reloadApprovalNeeded();
  }

  getReportCardStatus(reportCard: ReportCard) {
    let learningCounter = 0;
    for (let e = 0; e < this.level.events.length; e++) {
      const event = this.level.events[e];
      for (let s = 0; s < event.skills.length; s++) {
        const skill = event.skills[s];
        console.log(skill.rank);
        if (skill.rank === "LEARNING") {
          learningCounter++;
        }
      }
    }
    if (learningCounter > this.MAX_LEARNING_FOR_COMPLETED) {
      return "In Progress";
    } else {
      return "Completed";
    }
  }

  addAllComponentsToReportCard(reportCard: ReportCard) {
    this.data.deleteReportCardComponents(reportCard.id).subscribe(() => {
      if (typeof this.level.events !== "undefined") {
        for (let e = 0; e < this.level.events.length; e++) {
          const event = this.level.events[e];
          if (typeof event.skills !== "undefined") {
            for (let s = 0; s < event.skills.length; s++) {
              const skill = event.skills[s];
              if (typeof skill.rank !== "undefined") {
                let reportCardComponent = {} as ReportCardComponent;
                reportCardComponent.report_cards_id = reportCard.id;
                reportCardComponent.skills_id = skill.id;
                reportCardComponent.rank = skill.rank;
                this.addComponentToReportCard(reportCardComponent);
              }
            }
          }
        }
      }
    });
  }

  addComponentToReportCard(reportCardComponent: ReportCardComponent) {
    this.data.addReportCardComponent(reportCardComponent).subscribe(
      (data: ReportCardComponent) => {},
      (err: ErrorApi) => {
        console.error(err);
        let message = "Error Unknown...";
        if (err.error !== undefined) {
          message = err.error.message;
        }
        this.dialog.openSnackBar(message);
      }
    );
  }

  sessionChanged(newSession: string) {
    this.partialReportCard.session = newSession;
    console.log(this.partialReportCard);
    this.addPutReportCard();
  }

  deletePartialReportCard() {
    console.log("DELETEING: " + this.partialReportCard.id);
    this.data.deleteReportCard(this.partialReportCard.id).subscribe(
      () => {
        this.newReportCard = true;
        this.selectedAthlete = null;
        this.level = null;
        this.partialReportCard = null;
      },
      (err: ErrorApi) => {
        console.error(err);
        this.dialog.openSnackBar(err.error.message);
      }
    );
  }

  addPutReportCard() {
    if (this.newReportCard) {
      this.newReportCard = false;
      this.data.addReportCard(this.partialReportCard).subscribe(
        (data: ReportCard) => {
          console.log(data);
        },
        (err: ErrorApi) => {
          console.error(err);
          this.dialog.openSnackBar(err.message);
        }
      );
    } else {
      this.data.putReportCard(this.partialReportCard).subscribe(
        (data: ReportCard) => {
          console.log(data);
        },
        (err: ErrorApi) => {
          console.error(err);
          this.dialog.openSnackBar(err.message);
        }
      );
    }
  }

  generateReportCard(athleteId: number) {
    console.log(athleteId);
    let reportCardData: string[] = [];
    reportCardData.push(athleteId.toString());
    this.printService.printDocument("report-card", reportCardData);
  }
}

@Component({
  selector: "app-day-of-week-dialog",
  templateUrl: "./day-of-week-dialog.html"
})
export class DayOfWeekDialog {
  constructor(public dialogRef: MatDialogRef<DayOfWeekDialog>) {
    console.log("TEST: Created I guess");
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
