import { Component, OnInit, Inject } from '@angular/core';
import { Level } from '../interfaces/level';
import { DataService } from '../data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatExpansionPanel } from '@angular/material';
import { ReportCardCompleted } from '../interfaces/report-card-completed';
import { DialogService } from '../shared/dialog.service';
import { ReportCard } from '../interfaces/report-card';
import { ErrorApi } from '../interfaces/error-api';
import { MainNavComponent } from '../main-nav/main-nav.component';

@Component({
  selector: 'app-approve-report-cards',
  templateUrl: './approve-report-cards.component.html',
  styleUrls: ['./approve-report-cards.component.scss']
})
export class ApproveReportCardsComponent implements OnInit {

  public reportCards: ReportCard[] = [];

  constructor(private data: DataService, public dialog: MatDialog, private dialogService: DialogService, private mainNav: MainNavComponent) { }

  ngOnInit() {
    this.refreshReportCardsData();
  }

  refreshReportCardsData() {
    this.data.getReportCardsNeedingApproval().subscribe(
      (data : ReportCardCompleted[]) => { this.reportCards = data; }
    );
  }

  reportCardApproved(reportCardApproved: ReportCard) {
    console.log('This isnt being called???');
    console.log(reportCardApproved);
    for(let i=0; i< this.reportCards.length; i++) {
      if(this.reportCards[i].id === reportCardApproved.id) {
        this.reportCards.splice(i, 1);
        this.mainNav.reloadApprovalNeeded();
        return;
      }
    }
  }
}