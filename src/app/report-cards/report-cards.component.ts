
import { DataService } from '../data.service';
import { Component, OnInit, Inject } from '@angular/core';
import { Athlete } from '../interfaces/athlete';
import { Level } from '../interfaces/level';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-report-cards',
  templateUrl: './report-cards.component.html',
  styleUrls: ['./report-cards.component.scss']
})

export class ReportCardsComponent implements OnInit {

  levels: Level[];
  level: string;

  public selectedAthlete: Athlete;
  test: string;

  constructor(private data: DataService, public dialog: MatDialog) { }

  ngOnInit() {

    this.data.getLevels().subscribe((data : Level[]) => {
      console.log(data);

      this.levels = data;
      console.log(this.levels[0].name);
      this.level = this.levels[0].name;
    });

  }

  openLevelSelectDialog(): void {
    console.log(this.selectedAthlete);

    const dialogRef = this.dialog.open(LevelSelectDialog, {
      width: '500px',
      data: { levels: this.levels, selectedLevel: this.level }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  submitForApproval() {
    console.log("SUBMITTED");
  }

  myCrazyCallback(newAthlete: Athlete) {
    console.log(newAthlete);
    this.selectedAthlete = newAthlete;
  }
}

export interface LevelDialogData {
  levels: Level[];
  selectedLevel: Level;
}

@Component({
  selector: 'app-level-select-dialog',
  templateUrl: './level-select-dialog.html',
})
export class LevelSelectDialog {

  selectedLevel: Level;
  constructor(
    public dialogRef: MatDialogRef<LevelSelectDialog>,
    @Inject(MAT_DIALOG_DATA) public data: LevelDialogData
  ) {
    console.log(data.levels);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}