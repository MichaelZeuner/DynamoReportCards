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

  public reportCardsFull: ReportCard[] = [];
  public reportCards: ReportCard[] = [];
  public sunChecked: Boolean = true;
  public monChecked: Boolean = true;
  public tueChecked: Boolean = true;
  public wedChecked: Boolean = true;
  public thuChecked: Boolean = true;
  public friChecked: Boolean = true;
  public satChecked: Boolean = true;

  constructor(private data: DataService, public dialog: MatDialog, private dialogService: DialogService, private mainNav: MainNavComponent) { }

  ngOnInit() {
    this.refreshReportCardsData();
  }

  refreshReportCardsData() {
    this.data.getReportCardsNeedingApproval().subscribe(
      (data : ReportCardCompleted[]) => { 
        this.reportCardsFull = data;
        this.reportCards = this.reportCardsFull; 
      }
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

  adjustDisplayedCards() {
    this.reportCards = [];
    for(let i=0; i< this.reportCardsFull.length; i++) {
      if(this.sunChecked && this.reportCardsFull[i].day_of_week === 'SUN') { this.reportCards.push(this.reportCardsFull[i]); }
      else if(this.monChecked && this.reportCardsFull[i].day_of_week === 'MON') { this.reportCards.push(this.reportCardsFull[i]); }
      else if(this.tueChecked && this.reportCardsFull[i].day_of_week === 'TUE') { this.reportCards.push(this.reportCardsFull[i]); }
      else if(this.wedChecked && this.reportCardsFull[i].day_of_week === 'WED') { this.reportCards.push(this.reportCardsFull[i]); }
      else if(this.thuChecked && this.reportCardsFull[i].day_of_week === 'THU') { this.reportCards.push(this.reportCardsFull[i]); }
      else if(this.friChecked && this.reportCardsFull[i].day_of_week === 'FRI') { this.reportCards.push(this.reportCardsFull[i]); }
      else if(this.satChecked && this.reportCardsFull[i].day_of_week === 'SAT') { this.reportCards.push(this.reportCardsFull[i]); }
    }
  }
}