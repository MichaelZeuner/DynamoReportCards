import { Component, OnInit, Inject } from '@angular/core';
import { Level } from '../interfaces/level';
import { DataService } from '../data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-approve-report-cards',
  templateUrl: './approve-report-cards.component.html',
  styleUrls: ['./approve-report-cards.component.scss']
})
export class ApproveReportCardsComponent implements OnInit {

  constructor(private data: DataService, public dialog: MatDialog) { }

  levels: Level[];
  modifications: string = '';
  comment: string = 'Lorem ipsum sollicitudin torquent sapien maecenas habitant egestas, ut scelerisque tincidunt auctor amet venenatis, elit hac imperdiet tristique dapibus ipsum bibendum praesent consectetur fermentum purus metus per massa lobortis, commodo ad turpis arcu inceptos mollis elementum ligula viverra himenaeos nisi pulvinar laoreet arcu platea aliquet morbi, tincidunt orci nostra sed in hac massa eu et, tempus elit convallis vehicula auctor donec vulputate aliquam.';

  ngOnInit() {
    this.data.getLevels().subscribe((data : Level[]) => {
      console.log(data);

      this.levels = data;
      console.log(this.levels[0].name);
    });

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(RequiredModificationsDialog, {
      width: '500px',
      data: { comment: this.comment, modifications: this.modifications }
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