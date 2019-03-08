
import { DataService } from '../data.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Athlete } from '../interfaces/athlete';
import { Level } from '../interfaces/level';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-report-cards',
  templateUrl: './report-cards.component.html',
  styleUrls: ['./report-cards.component.scss']
})

export class ReportCardsComponent implements OnInit {

  myControl = new FormControl();
  filteredAthletes: Observable<Athlete[]>;

  athletes: Athlete[];
  levels: Level[];
  level: string;

  constructor(private data: DataService, public dialog: MatDialog) { }

  ngOnInit() {

    this.data.getLevels().subscribe((data : Level[]) => {
      console.log(data);

      this.levels = data;
      console.log(this.levels[0].name);
      this.level = this.levels[0].name;
    });

    this.data.getAthletes().subscribe((data : Athlete[]) => {
      this.athletes = data;

      console.log(this.athletes);

      this.filteredAthletes = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    });
  }

  private _filter(value: string): Athlete[] {
    const filterValue = value.toLowerCase();

    return this.athletes.filter(option => option.first_name.toLowerCase().indexOf(filterValue) === 0 || option.last_name.toLowerCase().indexOf(filterValue) === 0);
  }

  openLevelSelectDialog(): void {
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