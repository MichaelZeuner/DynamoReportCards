import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { DataService } from "../data.service";
import { ReportCardCompleted } from "../interfaces/report-card-completed";
import { ReportCard } from "../interfaces/report-card";
import { ErrorApi } from "../interfaces/error-api";
import { PrintService } from "../print.service";
import { AuthService } from "../auth/auth.service";
import { Observable } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material";
import { DialogService } from "../shared/dialog.service";

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

export interface CompletedReportCardElement {
  athlete: string;
  level: string;
  submitted_by: string;
  approved_by: string;
  generate_btn: string;
}

@Component({
  selector: "app-completed-report-cards",
  templateUrl: "./completed-report-cards.component.html",
  styleUrls: ["./completed-report-cards.component.scss"]
})
export class CompletedReportCardsComponent implements OnInit {
  public reportCards: ReportCardCompleted[] = [];

  displayedColumns: string[];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private data: DataService,
    public printService: PrintService,
    public authService: AuthService,
    public matDialog: MatDialog
  ) {
    this.displayedColumns = [
      "athlete",
      "level",
      "submitted_by",
      "approved_by",
      "generate_btn"
    ];

    if (
      this.authService.user.access === "ADMIN" ||
      this.authService.user.access === "SUPERVISOR"
    ) {
      this.displayedColumns.push("modify_btn");
    }
  }

  ngOnInit() {
    this.updateReportCards();
  }

  updateReportCards() {
    this.data.getReportCardsCompleted().subscribe(
      (data: ReportCardCompleted[]) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.reportCards = data;
        console.log(this.reportCards);
      },
      (err: ErrorApi) => {}
    );
  }

  generateReportCard(athleteId: number) {
    console.log(athleteId);
    let reportCardData: string[] = [];
    reportCardData.push(athleteId.toString());
    this.printService.printDocument("report-card", reportCardData);
  }

  modifyReportCard(reportCard: ReportCardCompleted) {
    console.log("Modify This Report Card:", reportCard);

    const dialogRef = this.matDialog.open(ModifyReportCardDialog, {
      width: "90%",
      height: "75%",
      data: reportCard
    });

    dialogRef.afterClosed().subscribe(() => {
      this.updateReportCards();
    });
  }
}

@Component({
  selector: "app-modify-report-card-dialog",
  templateUrl: "./modify-report-card-dialog.html"
})
export class ModifyReportCardDialog {
  public reportCard: ReportCard;

  constructor(
    public dialogRef: MatDialogRef<ModifyReportCardDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialog: DialogService
  ) {
    console.log("TEST: Created I guess");
    this.reportCard = data;
  }

  reportCardApproved(reportCardApproved: ReportCard) {
    this.dialog.openSnackBar("Report Card Updated");
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
