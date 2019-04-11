import { Component, OnInit, Inject } from '@angular/core';
import { Level } from '../interfaces/level';
import { DataService } from '../data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatExpansionPanel } from '@angular/material';
import { ReportCardCompleted } from '../interfaces/report-card-completed';
import { DialogService } from '../shared/dialog.service';
import { ReportCard } from '../interfaces/report-card';

@Component({
  selector: 'app-approve-report-cards',
  templateUrl: './approve-report-cards.component.html',
  styleUrls: ['./approve-report-cards.component.scss']
})
export class ApproveReportCardsComponent implements OnInit {

  public reportCards: ReportCard[];

  constructor(private data: DataService, public dialog: MatDialog, private dialogService: DialogService) { }

  ngOnInit() {
    this.refreshReportCardsData();
  }

  refreshReportCardsData() {
    console.log('refreshing...');
    this.data.getReportCardsNeedingApproval().subscribe((data : ReportCardCompleted[]) => {
      console.log(data);
      this.reportCards = data;
    });
  }
}