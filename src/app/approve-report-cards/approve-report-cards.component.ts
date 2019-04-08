import { Component, OnInit, Inject } from '@angular/core';
import { Level } from '../interfaces/level';
import { DataService } from '../data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatExpansionPanel } from '@angular/material';
import { ReportCardCompleted } from '../interfaces/report-card-completed';
import { DialogService } from '../shared/dialog.service';

interface ChangedRanks {
  skill_id: number,
  new_rank: string
}

@Component({
  selector: 'app-approve-report-cards',
  templateUrl: './approve-report-cards.component.html',
  styleUrls: ['./approve-report-cards.component.scss']
})
export class ApproveReportCardsComponent implements OnInit {

  constructor(private data: DataService, public dialog: MatDialog, private dialogService: DialogService) { }

  changedRanks: ChangedRanks[] = [];
  reportCards: ReportCardCompleted[];
  modifications: string = '';
  panelOpenState: boolean;

  ngOnInit() {
    this.refreshReportCardsData();
  }

  expandPanel(matExpansionPanel: MatExpansionPanel, event: Event) {
    event.stopPropagation();
    
    //if (!this._isExpansionIndicator(event.target)) {
    //  matExpansionPanel.close();
    //}
  }
  
  //private _isExpansionIndicator(target: EventTarget): boolean {
  //  const expansionIndicatorClass = 'mat-expansion-indicator';
  //  return (target.classList && target.classList.contains(expansionIndicatorClass) );
  //}

  refreshReportCardsData() {
    console.log('refreshing...');
    this.data.getReportCardsNeedingApproval().subscribe((data : ReportCardCompleted[]) => {
      console.log(data);
      this.reportCards = data;
    });
  }

  skillRankChanged(reportCard: ReportCardCompleted, newRank: string) {
    for(let i=0; i<this.reportCards.length; i++) {
      const current = this.reportCards[i];
      if(current.id === reportCard.id) {
        for(let x=0; x<current.components.length; x++) {
          const component = current.components[x];
          for(let y=0; y<this.changedRanks.length; y++) {
            const changedRank = this.changedRanks[y];
            if(changedRank.skill_id === component.skills_id) {
              if(component.rank === newRank) {
                this.changedRanks.splice(y, 1);
                return;
              }
            }
          }
          if(component.rank !== newRank) {
            this.changedRanks.push({skill_id: component.skills_id, new_rank: newRank});
            return;
          }
        }
      }
    }
  }

  openDialog(comment: string): void {
    console.log(comment);
    const dialogRef = this.dialog.open(RequiredModificationsDialog, {
      width: '500px',
      data: { comment: comment, modifications: this.modifications }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(typeof result === 'undefined') {
        result = '';
      }
      this.modifications = result;
      console.log('new comment:' + this.modifications);
    });
  }

  onClosed(matExpansionPanel: MatExpansionPanel) {
    console.log("closing");
    console.log(matExpansionPanel);
    matExpansionPanel.open();
    if(this.modifications !== '' || this.changedRanks.length > 0) {
    this.dialogService.openConfirmDialog('Are you sure you wish to close the active report card? Doing so will remove and unsaved work.')
      .afterClosed().subscribe(res => {
        if(res) {
          this.modifications = '';
          this.refreshReportCardsData();
        }
      });
    }
  }

}

export interface DialogData {
  comment: string;
  modifications: string;
}

@Component({
  selector: 'app-required-modifications-dialog',
  templateUrl: './required-modifications-dialog.html',
})
export class RequiredModificationsDialog {

  constructor(
    public dialogRef: MatDialogRef<RequiredModificationsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    console.log('TEST: ' + data.comment);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-required-modifications-dialog',
  template: `
    <div mat-dialog-content>
      <p>You are about to close a report card with unsaved changed. Doing so will r</p>
      <mat-form-field class="w-100">
          <textarea matInput rows="10" placeholder="Enter modification notes" [(ngModel)]="data.modifications"></textarea>
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-raised-button color="warn" (click)="onNoClick()">Clear Comments</button>
      <button mat-raised-button color="accent" [mat-dialog-close]="data.modifications" cdkFocusInitial>Submit Comments</button>
    </div>
  `,
})
export class CloseReportCardDialog {

  constructor(public dialogRef: MatDialogRef<CloseReportCardDialog>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}