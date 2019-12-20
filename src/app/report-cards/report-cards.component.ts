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
import { LevelSelectComponent } from "./level-select.component";
import { RecentSimilarReportCards } from "../recent-similar-report-cards";
import { User } from "../interfaces/user";
import { PreviousLevel } from "../interfaces/previous-level";

@Component({
  selector: "app-report-cards",
  templateUrl: "./report-cards.component.html",
  styleUrls: ["./report-cards.component.scss"]
})
export class ReportCardsComponent implements OnInit {
  UNSELECTED: number = -1;

  public level: Level;
  public selectedAthlete: Athlete;
  public selectedSecondaryCoach: User;
  public skillName: string;
  public eventName: string;
  @ViewChild("athleteSelect") athleteSelect: AthletesSelectComponent;
  @ViewChild("levelSelect") levelSelect: LevelSelectComponent;

  public commentsBase: Comments[] = [];
  public commentsPreviousRemoved: Comments[] = [];
  public commentsActive: Comments[] = [];

  personalityCategories: String[] = [
    "Brave",
    "Energy",
    "General",
    "Strength",
    "Social"
  ];

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
  selectedPersonalityComment: number = this.UNSELECTED;
  selectedPersonalityCategoryComment: String = "";

  prevLevels: PreviousLevel[] = [];

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
    this.mainNav.displayLoading = true;
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
        this.mainNav.displayLoading = false;
        console.log(partialReportCards);
        if (partialReportCards.length > 0) {
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
                " (" +
                partialReportCards[i].athlete.date_of_birth +
                ") - " +
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
        }
      },
      (err: ErrorApi) => {
        console.error(err);
        this.mainNav.displayLoading = false;
      }
    );
  }

  getSessionByCurrentMonth(): string {
    const month = new Date().getMonth();
    switch (month) {
      case 12:
      case 1:
      case 2:
        return "WINTER";
      case 3:
      case 4:
      case 5:
        return "SPRING";
      case 6:
      case 7:
      case 8:
        return "SUMMER";
      case 9:
      case 10:
      case 11:
        return "FALL";
    }
  }

  updatePartialReportCard(partialReportCard: ReportCardCompleted) {
    console.log("LOADING REPORTCARD:", partialReportCard);
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

    this.mainNav.displayLoading = true;
    this.data.getLevelEvents(this.level.id).subscribe(
      (data: Event[]) => {
        this.mainNav.displayLoading = false;
        this.events = data;
      },
      () => {
        this.mainNav.displayLoading = false;
      }
    );

    this.selectedSecondaryCoach = partialReportCard.secondary_coach;
    this.selectedAthlete = partialReportCard.athlete;
    this.partialReportCard = partialReportCard;
    this.updateCommentsForSlectedAthlete(this.level.id);
    this.newReportCard = false;
  }

  eventChanged(eventId: number) {
    this.selectedEvent = eventId;
    this.mainNav.displayLoading = true;
    this.data.getEventSkills(this.level.id, eventId).subscribe(
      (data: Skill[]) => {
        this.mainNav.displayLoading = false;
        this.skills = data;
      },
      () => {
        this.mainNav.displayLoading = false;
      }
    );
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

  updateSelectSecondaryCoach(newSecondaryCoach: User) {
    this.selectedSecondaryCoach = newSecondaryCoach;
    this.partialReportCard.secondary_coach_id = newSecondaryCoach.id;
    this.addPutReportCard();
  }

  loadLevel(prevLevel: PreviousLevel) {
    this.levelSelect.onLevelChange(
      prevLevel.name + " Level " + prevLevel.next_level_number
    );
  }

  updateSelectAthlete(newAthlete: Athlete) {
    this.selectedAthlete = newAthlete;

    this.data.getPreviousAthleteLevel(newAthlete.id).subscribe(
      (data: PreviousLevel[]) => {
        console.log(data);
        this.prevLevels = data;
      },
      (err: ErrorApi) => {
        console.error(err);
        console.log("no previous report card");
        this.prevLevels = null;
      }
    );
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

  setLevelText(text: string) {
    this.levelSelect.myControlLevel.setValue(text);
  }

  async cancelReportCard(level: Level, athlete: Athlete): Promise<Boolean> {
    let recent: RecentSimilarReportCards;
    recent = await this.data
      .getRecentSimilarReportCard(athlete.id, level.id)
      .toPromise();
    if (recent.recentlyDone) {
      let message;
      if (recent.type === "Partial") {
        message =
          "A report card has already been started for " +
          athlete.first_name +
          " level " +
          level.name +
          " Level " +
          level.level_number +
          ".";
      } else {
        message =
          "A report card was already completed " + recent.type + " days ago.";
      }
      let ret = await this.dialog
        .openConfirmDialog(
          message + " Would you like to cancel this report card? (Yes)"
        )
        .afterClosed()
        .toPromise();
      return ret;
    } else {
      return false;
    }
  }

  async updateSelectLevel(newLevel: Level) {
    if (newLevel === null) {
      return;
    }

    if (await this.cancelReportCard(newLevel, this.selectedAthlete)) {
      console.log("CANCELED");
      this.athleteSelect.clearAthlete();
      this.levelSelect.clearLevel();
      this.clearPartialReportCard();
      return;
    }
    console.log("KEEP MOVING!");

    console.log(newLevel);
    this.level = newLevel;

    let levelId: number = this.level === null ? -1 : this.level.id;
    this.partialReportCard = {
      submitted_by: this.auth.user.id,
      secondary_coach_id: null,
      athletes_id: this.selectedAthlete.id,
      levels_id: levelId,
      comment: 0,
      day_of_week: "UNSET",
      session: this.getSessionByCurrentMonth(),
      status: "Partial"
    };

    if (this.level !== null) {
      this.updateCommentsForSlectedAthlete(levelId);

      this.mainNav.displayLoading = true;
      this.data.getLevelEvents(levelId).subscribe(
        (data: Event[]) => {
          this.mainNav.displayLoading = false;
          console.log(data);
          this.events = data;
        },
        () => {
          this.mainNav.displayLoading = false;
        }
      );
    }
  }

  updateCommentsForSlectedAthlete(levelId: number) {
    this.mainNav.displayLoading = true;
    this.data
      .getAthletesAttemptsAtLevel(this.selectedAthlete.id, levelId)
      .subscribe(
        (previousReportCards: ReportCardCompleted[]) => {
          this.mainNav.displayLoading = false;
          this.commentsPreviousRemoved = this.comm.deepCopy(this.commentsBase);
          for (let i = this.commentsPreviousRemoved.length - 1; i >= 0; i--) {
            for (let x = 0; x < previousReportCards.length; x++) {
              if (
                this.commentsPreviousRemoved[i].id ===
                  previousReportCards[x].card_comments.intro_comment_id ||
                this.commentsPreviousRemoved[i].id ===
                  previousReportCards[x].card_comments.skill_comment_id ||
                this.commentsPreviousRemoved[i].id ===
                  previousReportCards[x].card_comments.personality_comment_id ||
                this.commentsPreviousRemoved[i].id ===
                  previousReportCards[x].card_comments.closing_comment_id
              ) {
                this.commentsPreviousRemoved.splice(i, 1);
                break;
              }
            }
          }
          this.updateComments();
        },
        (err: ErrorApi) => {
          console.error(err);
          this.mainNav.displayLoading = false;
        }
      );
  }

  async addEventComponents(event: Event) {
    let currentLoadingState = this.mainNav.displayLoading;
    if (this.newReportCard) {
      this.newReportCard = false;
      this.mainNav.displayLoading = true;
      this.partialReportCard = await this.data
        .addReportCard(this.partialReportCard)
        .toPromise();

      this.mainNav.displayLoading = currentLoadingState;
    }

    await this.addAllComponentsToReportCard(event);
  }

  onEventsChange(event: Event) {
    if (typeof this.level.events !== "undefined") {
      for (let i = 0; i < this.level.events.length; i++) {
        if (typeof this.level.events[i].skills !== "undefined") {
          this.newReportCard = false;
        }
      }
    }

    this.addEventComponents(event);

    let pushEvent = false;
    if (typeof this.level.events !== "undefined") {
      for (let i = 0; i < this.level.events.length; i++) {
        if (this.level.events[i].id === event.id) {
          this.level.events[i] = event;
          break;
        }
        if (i === this.level.events.length - 1) {
          pushEvent = true;
        }
      }
    } else {
      this.level.events = [];
      pushEvent = true;
    }
    if (pushEvent) {
      this.level.events.push(event);
    }
  }

  async setAllMastered() {
    this.mainNav.displayLoading = true;
    console.log("Set all mastered");

    console.log(this.level);
    this.level.events = await this.data
      .getLevelEvents(this.level.id)
      .toPromise();
    for (let i = 0; i < this.level.events.length; i++) {
      this.level.events[i].skills = await this.data
        .getEventSkills(this.level.id, this.level.events[i].id)
        .toPromise();
      for (let x = 0; x < this.level.events[i].skills.length; x++) {
        this.level.events[i].skills[x].rank = "MASTERED";
      }
      await this.addEventComponents(this.level.events[i]);
    }

    let partialReportCards: ReportCardCompleted[] = await this.data
      .getCoachesInProgressReportCard()
      .toPromise();

    for (let i = 0; i < partialReportCards.length; i++) {
      if (partialReportCards[i].id === this.partialReportCard.id) {
        this.updatePartialReportCard(partialReportCards[i]);
        break;
      }
    }

    this.dialog.openSnackBar("All skills set to Mastered");
    this.mainNav.displayLoading = false;
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

    if (this.selectedPersonalityComment === this.UNSELECTED) {
      this.dialog.openSnackBar("Personality comment required!");
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

    dialogRef.afterClosed().subscribe(async dayOfWeek => {
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

      let errors = await this.getErrors();
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

  async getErrors(): Promise<string[]> {
    let errors: string[] = [];

    let pushRequired: boolean;
    const events: Event[] = await this.data
      .getLevelEvents(this.level.id)
      .toPromise();
    if (this.level.events.length !== events.length) {
      for (let i = 0; i < events.length; i++) {
        pushRequired = true;
        for (let x = 0; x < this.level.events.length; x++) {
          if (this.level.events[x].id === events[i].id) {
            pushRequired = false;
            break;
          }
        }
        if (pushRequired) {
          errors.push(`all the skills in ${events[i].name}`);
        }
      }
    }

    for (let i = 0; i < this.level.events.length; i++) {
      const skills: Skill[] = await this.data
        .getEventSkills(this.level.id, this.level.events[i].id)
        .toPromise();
      if (this.level.events[i].skills.length !== skills.length) {
        for (let x = 0; x < skills.length; x++) {
          pushRequired = true;
          for (let y = 0; y < this.level.events[i].skills.length; y++) {
            if (this.level.events[i].skills[y].id === skills[x].id) {
              pushRequired = false;
              break;
            }
          }
          if (pushRequired) {
            errors.push(`${skills[x].name} in ${this.level.events[i].name}`);
          }
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
      personality_comment_id: this.selectedPersonalityComment,
      closing_comment_id: this.selectedClosingComment
    };

    let addedReportCardComment: ReportCardComments;
    this.mainNav.displayLoading = true;
    this.data.addReportCardComment(comment).subscribe(
      (data: ReportCardComments) => {
        this.mainNav.displayLoading = false;
        addedReportCardComment = data;
        this.addReportCard(dayOfWeek, addedReportCardComment);
      },
      (err: ErrorApi) => {
        console.error(err);
        this.mainNav.displayLoading = false;
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
    this.levelSelect.clearLevel();
    this.dialog.openSnackBar("Report card has been submitted for approval!");
    this.mainNav.reloadApprovalNeeded();

    this.clearPartialReportCard();
  }

  getReportCardStatus(reportCard: ReportCard) {
    let learningCounter = 0;
    for (let e = 0; e < this.level.events.length; e++) {
      const event = this.level.events[e];
      for (let s = 0; s < event.skills.length; s++) {
        const skill = event.skills[s];
        console.log(skill.rank);
        if (skill.rank === this.comm.SKILL_RANK_LEARNING) {
          learningCounter++;
        }
      }
    }
    if (learningCounter > this.comm.MAX_LEARNING_FOR_COMPLETED) {
      return this.comm.STATUS_IN_PROGRESS;
    } else {
      return this.comm.STATUS_COMPLETED;
    }
  }

  async addAllComponentsToReportCard(event: any) {
    let currentLoadingState = this.mainNav.displayLoading;
    if (typeof event.skills !== "undefined") {
      for (let s = 0; s < event.skills.length; s++) {
        const skill = event.skills[s];
        if (typeof skill.rank !== "undefined") {
          let reportCardComponent = {} as ReportCardComponent;
          reportCardComponent.report_cards_id = this.partialReportCard.id;
          reportCardComponent.skills_id = skill.id;
          reportCardComponent.rank = skill.rank;

          this.mainNav.displayLoading = true;
          await this.data
            .addOrUpdateReportCardComponent(reportCardComponent)
            .toPromise();
          this.mainNav.displayLoading = currentLoadingState;
        }
      }
    }
  }

  sessionChanged(newSession: string) {
    this.partialReportCard.session = newSession;
    console.log(this.partialReportCard);
    this.addPutReportCard();
  }

  async deletePartialReportCard() {
    let deleteReportCard = await this.dialog
      .openConfirmDialog(
        "Are you sure you wish to delete this partial report card? This cannot be undone!"
      )
      .afterClosed()
      .toPromise();
    if (deleteReportCard === false) {
      return;
    }

    console.log("DELETEING: " + this.partialReportCard.id);
    this.mainNav.displayLoading = true;
    this.data.deleteReportCard(this.partialReportCard.id).subscribe(
      () => {
        this.mainNav.displayLoading = false;
        this.clearPartialReportCard();
      },
      (err: ErrorApi) => {
        console.error(err);
        this.mainNav.displayLoading = false;
        this.dialog.openSnackBar(err.error.message);
      }
    );
  }

  clearPartialReportCard() {
    this.newReportCard = true;
    this.selectedAthlete = null;
    this.level = null;
    this.partialReportCard = null;
  }

  addPutReportCard() {
    if (this.newReportCard) {
      this.newReportCard = false;
      this.mainNav.displayLoading = true;
      this.data.addReportCard(this.partialReportCard).subscribe(
        (data: ReportCard) => {
          this.mainNav.displayLoading = false;
          console.log(data);
        },
        (err: ErrorApi) => {
          console.error(err);
          this.mainNav.displayLoading = false;
          this.dialog.openSnackBar(err.message);
        }
      );
    } else {
      this.mainNav.displayLoading = true;
      console.log(this.partialReportCard);
      this.data.putReportCard(this.partialReportCard).subscribe(
        (data: ReportCard) => {
          this.mainNav.displayLoading = false;
          console.log(data);
        },
        (err: ErrorApi) => {
          console.error(err);
          this.mainNav.displayLoading = false;
          this.dialog.openSnackBar(err.message);
        }
      );
    }
  }

  generateReportCard(athleteId: number, levelGroupId: number) {
    console.log(athleteId);
    let reportCardData: string[] = [];
    reportCardData.push(athleteId.toString());
    reportCardData.push(levelGroupId.toString());
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
