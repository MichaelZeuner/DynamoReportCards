import { Component, OnInit, Inject } from "@angular/core";
import { DataService } from "../data.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatExpansionPanel
} from "@angular/material";
import { ReportCardCompleted } from "../interfaces/report-card-completed";
import { DialogService } from "../shared/dialog.service";
import { ReportCard } from "../interfaces/report-card";
import { MainNavComponent } from "../main-nav/main-nav.component";

@Component({
  selector: "app-approve-report-cards",
  templateUrl: "./approve-report-cards.component.html",
  styleUrls: ["./approve-report-cards.component.scss"]
})
export class ApproveReportCardsComponent implements OnInit {
  public reportCardsFull: ReportCard[] = [];
  public reportCards: ReportCard[] = [];
  public sunChecked: Boolean = false;
  public sunCount: number = 0;
  public monChecked: Boolean = false;
  public monCount: number = 0;
  public tueChecked: Boolean = false;
  public tueCount: number = 0;
  public wedChecked: Boolean = false;
  public wedCount: number = 0;
  public thuChecked: Boolean = false;
  public thuCount: number = 0;
  public friChecked: Boolean = false;
  public friCount: number = 0;
  public satChecked: Boolean = false;
  public satCount: number = 0;

  constructor(
    private data: DataService,
    public dialog: MatDialog,
    private dialogService: DialogService,
    private mainNav: MainNavComponent
  ) {}

  ngOnInit() {
    this.refreshReportCardsData();
  }

  refreshReportCardsData() {
    this.data
      .getReportCardsNeedingApproval()
      .subscribe((data: ReportCardCompleted[]) => {
        console.log(data);
        this.reportCardsFull = data;
        this.reportCards = [];
        this.sumCounters();
        this.adjustDisplayedCards();
      });
  }

  sumCounters() {
    this.sunCount = 0;
    this.monCount = 0;
    this.tueCount = 0;
    this.wedCount = 0;
    this.thuCount = 0;
    this.friCount = 0;
    this.satCount = 0;
    for (let i = 0; i < this.reportCardsFull.length; i++) {
      switch (this.reportCardsFull[i].day_of_week) {
        case "SUN":
          this.sunCount++;
          break;
        case "MON":
          this.monCount++;
          break;
        case "TUE":
          this.tueCount++;
          break;
        case "WED":
          this.wedCount++;
          break;
        case "THU":
          this.thuCount++;
          break;
        case "FRI":
          this.friCount++;
          break;
        case "SAT":
          this.satCount++;
          break;
      }
    }
  }

  reportCardApproved(reportCardApproved: ReportCard) {
    for (let i = 0; i < this.reportCards.length; i++) {
      if (this.reportCards[i].id === reportCardApproved.id) {
        this.dialogService.openSnackBar("Report Card Processed!");
        this.reportCards.splice(i, 1);
        this.mainNav.reloadApprovalNeeded();
        this.mainNav.reloadReportCardsSentBack();
        this.refreshReportCardsData();
        return;
      }
    }
  }

  adjustDisplayedCards() {
    this.reportCards = [];
    for (let i = 0; i < this.reportCardsFull.length; i++) {
      if (this.sunChecked && this.reportCardsFull[i].day_of_week === "SUN") {
        this.reportCards.push(this.reportCardsFull[i]);
      } else if (
        this.monChecked &&
        this.reportCardsFull[i].day_of_week === "MON"
      ) {
        this.reportCards.push(this.reportCardsFull[i]);
      } else if (
        this.tueChecked &&
        this.reportCardsFull[i].day_of_week === "TUE"
      ) {
        this.reportCards.push(this.reportCardsFull[i]);
      } else if (
        this.wedChecked &&
        this.reportCardsFull[i].day_of_week === "WED"
      ) {
        this.reportCards.push(this.reportCardsFull[i]);
      } else if (
        this.thuChecked &&
        this.reportCardsFull[i].day_of_week === "THU"
      ) {
        this.reportCards.push(this.reportCardsFull[i]);
      } else if (
        this.friChecked &&
        this.reportCardsFull[i].day_of_week === "FRI"
      ) {
        this.reportCards.push(this.reportCardsFull[i]);
      } else if (
        this.satChecked &&
        this.reportCardsFull[i].day_of_week === "SAT"
      ) {
        this.reportCards.push(this.reportCardsFull[i]);
      }
    }
  }
}
