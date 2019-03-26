import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { Level } from 'src/app/interfaces/level';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/data.service';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-level-select',
  template: `
    <mat-form-field class="w-100 input-headline">
      <input 
        type="text" 
        placeholder="Select Level" 
        aria-label="Level Name" 
        matInput 
        [formControl]="myControl" 
        [matAutocomplete]="auto" 
        (input)="onLevelChange($event.target.value)">

      <mat-autocomplete 
        autoActiveFirstOption 
        #auto="matAutocomplete" 
        (optionSelected)='onLevelChange($event.option.value)'>

      <mat-option
        *ngFor="let level of filteredLevels | async" 
        [value]="level.name">
        {{level.name}}
      </mat-option>
      
      </mat-autocomplete>
    </mat-form-field>`,
  styles: [ ]
})
export class LevelSelectComponent {
  @Output() selectedLevelChange = new EventEmitter<Level>();

  public myControl = new FormControl();
  public filteredLevels: Observable<Level[]>;

  protected levels: Level[];
  protected selectedLevel: Level;

  constructor(private data: DataService) {
    this.data.getLevels().subscribe((data : Level[]) => {
      this.levels = data;

      console.log(this.levels);

      this.filteredLevels = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  });
  }

  private _filter(value: string): Level[] {
    const filterValue = value.toLowerCase();

    return this.levels.filter(
      option => (option.name.toLowerCase()).indexOf(filterValue) === 0
    );
  }

  onLevelChange(searchValue : string ) {  
    const currentLevel = this.selectedLevel;
    for(let i=0; i<this.levels.length; i++) {
      const level = this.levels[i];
      if(level.name === searchValue) {
        console.log('SETTING LEVEL');
        this.selectedLevel = level;
        break;
      } else {
        console.log('clear athlete');
        this.selectedLevel = null;
      }
    }

    if(currentLevel !== this.selectedLevel) {
      this.selectedLevelChange.emit(this.selectedLevel);  
    }
  }
}