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
import { MainNavComponent } from "../main-nav/main-nav.component";
import { first } from 'rxjs/operators';

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

  pageIndex = 0;
  pageSize = 10;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private data: DataService,
    public printService: PrintService,
    public authService: AuthService,
    public matDialog: MatDialog,
    private nav: MainNavComponent,
    private dialog: DialogService,
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
      this.displayedColumns.push("delete_btn");
    }
  }

  ngOnInit() {
    this.updateReportCards();
  }

  search(firstName: string, lastName: string, year: string, season: string) {
    console.log(firstName, lastName);
    let newData = [];
    for(let i=0; i<this.reportCards.length; i++) {
      console.log(this.reportCards[i].athlete.first_name.indexOf(firstName), this.reportCards[i].athlete.last_name.indexOf(lastName))
      console.log(year, this.reportCards[i].created_date, this.reportCards[i].session);
      if(this.reportCards[i].athlete.first_name.toLowerCase().indexOf(firstName.toLowerCase()) >= 0 && this.reportCards[i].athlete.last_name.toLowerCase().indexOf(lastName.toLowerCase()) >= 0
      && this.reportCards[i].created_date.toString().indexOf(year.toString()) >= 0 && (season == null || this.reportCards[i].session.indexOf(season) >= 0)){
        newData.push(this.reportCards[i]);
      }
    }
    console.log(newData);
    this.dataSource.data = newData;
  }

  handlePage(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateReportCards();
  }

  updateReportCards() {
    this.nav.displayLoading = true;
    this.data.getReportCardsCompleted(this.pageSize, this.pageIndex + 1).subscribe(
      (data: ReportCardCompleted[]) => {
        this.nav.displayLoading = false;
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.reportCards = data;
        console.log(this.reportCards);
      },
      (err: ErrorApi) => {
        this.nav.displayLoading = false;
      }
    );
  }

  generateReportCard(athleteId: number, levelGroupId: number) {
    console.log(athleteId);
    let reportCardData: string[] = [];
    reportCardData.push(athleteId.toString());
    reportCardData.push(levelGroupId.toString());
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

  async deleteReportCard(reportCard: ReportCardCompleted) {
    console.log("Delete This Report Card:", reportCard);

    if(await this.dialog.openConfirmDialog("Are you sure you wish to delete this report card? CANNOT BE UNDONE!").afterClosed().toPromise())
    {
      let res = await this.data.deleteReportCard(reportCard.id).toPromise();
      console.log(res);
      this.updateReportCards();
    }
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
    console.log("Report Card: ", data);
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
