
import { DataService } from '../data.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Api } from '../interfaces/api';
import { Level } from '../interfaces/level';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-report-cards',
  templateUrl: './report-cards.component.html',
  styleUrls: ['./report-cards.component.scss']
})

export class ReportCardsComponent implements OnInit {

  myControl = new FormControl();
  athletes: string[] = [];
  filteredAthletes: Observable<string[]>;

  apiValue: Api;
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

    this.data.getUsers().subscribe((data : Api) => {
      this.apiValue = data;
      for(let i=0; i<this.apiValue.data.length;i++) {
        this.athletes.push(this.apiValue.data[i].first_name + ' ' + this.apiValue.data[i].last_name);
      }

      this.filteredAthletes = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.athletes.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
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