import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from "@angular/core";
import { ReportCard } from "../../interfaces/report-card";
import { DataService } from "../../data.service";
import { MatExpansionPanel } from "@angular/material";
import { ErrorApi } from "../../interfaces/error-api";
import { ReportCardComponent } from "../../interfaces/report-card-component";
import { PrintService } from "../../print.service";
import { ReportCardSentBack } from "src/app/interfaces/report-card-sent-back";
import { DialogService } from "src/app/shared/dialog.service";
import { Comments } from "src/app/interfaces/comments";
import { Skill } from "src/app/interfaces/skill";
import { Event } from "src/app/interfaces/event";
import { ReportCardComments } from "src/app/interfaces/report-card-comments";
import { CommonService } from "src/app/shared/common.service";

@Component({
  selector: "app-report-card-modification-panel",
  templateUrl: "./report-card-modification-panel.component.html",
  styleUrls: ["./report-card-modification-panel.component.scss"]
})
export class ReportCardModificationPanelComponent implements OnInit {
  UNSELECTED: number = -1;

  @ViewChild("panel") panel: MatExpansionPanel;
  @Input() reportCard: ReportCardSentBack;

  @Output() reportCardSentBackChanged = new EventEmitter<ReportCardSentBack>();

  public commentsBase: Comments[] = [];
  public commentsActive: Comments[] = [];

  public events: Event[] = [];
  public skills: Skill[] = [];

  selectedIntroComment: number = this.UNSELECTED;
  selectedSkillComment: number = this.UNSELECTED;
  selectedSkillCommentEvent: number = this.UNSELECTED;
  selectedSkillCommentSkill: number = this.UNSELECTED;
  selectedClosingComment: number = this.UNSELECTED;

  prevIntro: string;
  prevEvent: string;
  prevSkill: string;
  prevGoal: string;
  prevClosing: string;

  skillsDisabled: boolean = false;

  constructor(
    public printService: PrintService,
    private data: DataService,
    private dialog: DialogService,
    private comm: CommonService
  ) {}

  generateCommentIdString(
    introComment: number,
    event: number,
    skill: number,
    skillComment: number,
    closingComment: number
  ) {
    return (
      introComment +
      "~" +
      event +
      "~" +
      skill +
      "~" +
      skillComment +
      "~" +
      closingComment
    );
  }

  generateUnmodifiedCommentIdString() {
    return this.generateCommentIdString(
      this.reportCard.card_mod_comments.intro_comment_id,
      this.reportCard.card_mod_comments.event_id,
      this.reportCard.card_mod_comments.skill_id,
      this.reportCard.card_mod_comments.skill_comment_id,
      this.reportCard.card_mod_comments.closing_comment_id
    );
  }

  generateCurrentCommentIdString() {
    return this.generateCommentIdString(
      this.selectedIntroComment,
      this.selectedSkillCommentEvent,
      this.selectedSkillCommentSkill,
      this.selectedSkillComment,
      this.selectedClosingComment
    );
  }

  ngOnInit() {
    this.selectedIntroComment = this.reportCard.card_mod_comments.intro_comment_id;
    this.selectedSkillComment = this.reportCard.card_mod_comments.skill_comment_id;
    this.selectedSkillCommentEvent = this.reportCard.card_mod_comments.event_id;
    this.selectedSkillCommentSkill = this.reportCard.card_mod_comments.skill_id;
    this.selectedClosingComment = this.reportCard.card_mod_comments.closing_comment_id;

    this.data.getComments().subscribe(
      (data: Comments[]) => {
        //this slight hack of stringify followed by parse is a simiple deep copy
        this.commentsBase = JSON.parse(JSON.stringify(data));
        this.commentsActive = JSON.parse(JSON.stringify(data));
        console.log(this.commentsBase);

        this.data.getLevelEvents(this.reportCard.level.id).subscribe(
          (data: Event[]) => {
            this.events = data;
            console.log(this.events);
            this.eventChanged(this.selectedSkillCommentEvent);
          },
          (err: ErrorApi) => {
            console.error(err);
            this.dialog.openSnackBar(err.error.message);
          }
        );
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

    this.getPrevComments();
  }

  getPrevComments() {
    this.data.getLevelEvents(this.reportCard.level.id).subscribe(
      (data: Event[]) => {
        for (let e = 0; e < data.length; e++) {
          if (data[e].id === this.reportCard.card_comments.event_id) {
            this.prevEvent = data[e].name;
          }
        }

        this.data
          .getEventSkills(
            this.reportCard.level.id,
            this.reportCard.card_comments.event_id
          )
          .subscribe(
            (data: Skill[]) => {
              for (let s = 0; s < data.length; s++) {
                if (data[s].id === this.reportCard.card_comments.skill_id) {
                  this.prevSkill = data[s].name;
                }
              }

              for (let i = 0; i < this.commentsBase.length; i++) {
                if (
                  this.commentsBase[i].id ===
                  this.reportCard.card_comments.intro_comment_id
                ) {
                  this.prevIntro = this.comm.replaceComment(
                    this.commentsBase[i].comment,
                    this.reportCard.athlete.first_name,
                    this.prevEvent,
                    this.prevSkill
                  );
                }

                if (
                  this.commentsBase[i].id ===
                  this.reportCard.card_comments.skill_comment_id
                ) {
                  this.prevGoal = this.comm.replaceComment(
                    this.commentsBase[i].comment,
                    this.reportCard.athlete.first_name,
                    this.prevEvent,
                    this.prevSkill
                  );
                }

                if (
                  this.commentsBase[i].id ===
                  this.reportCard.card_comments.closing_comment_id
                ) {
                  this.prevClosing = this.comm.replaceComment(
                    this.commentsBase[i].comment,
                    this.reportCard.athlete.first_name,
                    this.prevEvent,
                    this.prevSkill
                  );
                }
              }
            },
            (err: ErrorApi) => {
              console.error(err);
              this.dialog.openSnackBar(err.error.message);
            }
          );
      },
      (err: ErrorApi) => {
        console.error(err);
        this.dialog.openSnackBar(err.error.message);
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

    if (typeof skillName === "undefined") {
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

  eventChanged(eventId: number) {
    console.log("New event id: " + eventId);
    this.selectedSkillCommentEvent = eventId;
    this.data.getEventSkills(this.reportCard.level.id, eventId).subscribe(
      (data: Skill[]) => {
        this.skills = data;
        console.log(data);
        this.updateComments();
      },
      (err: ErrorApi) => {
        console.error(err);
        this.dialog.openSnackBar(err.error.message);
      }
    );
  }

  generateReportCurrentCardComment(): ReportCardComments {
    return {
      intro_comment_id: this.selectedIntroComment,
      event_id: this.selectedSkillCommentEvent,
      skill_id: this.selectedSkillCommentSkill,
      skill_comment_id: this.selectedSkillComment,
      closing_comment_id: this.selectedClosingComment
    };
  }

  generateReportCard(athleteId: number) {
    console.log(athleteId);
    let reportCardData: string[] = [];
    reportCardData.push(athleteId.toString());
    this.printService.printDocument("report-card", reportCardData);
  }

  skillRankChanged(newRank: string, id: number) {
    for (let x = 0; x < this.reportCard.components.length; x++) {
      const component = this.reportCard.components[x];
      if (component.report_cards_components_id === id) {
        this.reportCard.components[x].rank = newRank;
      }
    }
  }

  submitReportCard() {
    if (this.generateCurrentCommentIdString().indexOf("-1") !== -1) {
      this.dialog.openSnackBar("All comment options must be selected!");
      return;
    }

    this.dialog
      .openConfirmDialog(
        "Are you sure you wish to resubmit this report card to the supervisor?"
      )
      .afterClosed()
      .subscribe(res => {
        if (res) {
          if (
            this.generateUnmodifiedCommentIdString() !==
            this.generateCurrentCommentIdString()
          ) {
            let newComment: ReportCardComments = this.generateReportCurrentCardComment();
            this.data.addReportCardComment(newComment).subscribe(
              (data: ReportCardComments) => {
                this.updateReportCard(data.id);
              },
              (err: ErrorApi) => {
                console.error(err.error.message);
                this.dialog.openSnackBar(err.error.message);
              }
            );
          } else {
            this.updateReportCard(this.reportCard.comment);
          }
        }
      });
  }

  updateReportCard(commentModId: number) {
    let sendBackReportCard: any = {
      id: this.reportCard.report_cards_id,
      athletes_id: this.reportCard.athlete.id,
      levels_id: this.reportCard.level.id,
      comment: commentModId,
      approved: null,
      status: this.reportCard.status
    };

    console.log("Report Card to Send Back:");
    console.log(sendBackReportCard);

    this.data.putReportCard(sendBackReportCard).subscribe(
      (data: ReportCard) => {
        console.log(data);
        this.updateReportCardComponents();
      },
      (err: ErrorApi) => {
        console.error(err);
      }
    );
  }

  updateReportCardComponents() {
    for (let i = 0; i < this.reportCard.components.length; i++) {
      let sendBackReportCardComponent: any = {
        id: this.reportCard.components[i].report_cards_components_id,
        report_cards_id: this.reportCard.report_cards_id,
        skills_id: this.reportCard.components[i].skill.id,
        rank: this.reportCard.components[i].rank
      };

      this.data.putReportCardComponent(sendBackReportCardComponent).subscribe(
        (data: ReportCardComponent) => {
          console.log(data);
        },
        (err: ErrorApi) => {
          console.error(err);
        }
      );
    }

    this.triggerDeleteReportCardMod();
  }

  triggerDeleteReportCardMod() {
    this.data
      .deleteReportCardMod(this.reportCard.report_cards_mod_id)
      .subscribe(
        (data: any) => {
          console.log(data);

          this.dialog.openSnackBar("Report Card Updated and Sent Back!");
          console.log("About to emit reportcard");
          this.reportCardSentBackChanged.emit(this.reportCard);
        },
        (err: ErrorApi) => {
          console.error(err);
        }
      );

    this.triggerDeleteReportCardModComponents();
  }

  triggerDeleteReportCardModComponents() {
    for (let i = 0; i < this.reportCard.components.length; i++) {
      if (
        this.reportCard.components[i].report_cards_mod_components_id != null
      ) {
        this.data
          .deleteReportCardModComponent(
            this.reportCard.components[i].report_cards_mod_components_id
          )
          .subscribe(
            (data: any) => {
              console.log(data);
            },
            (err: ErrorApi) => {
              console.error(err);
            }
          );
      }
    }
  }
}
