
import { DataService } from '../data.service';
import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Athlete } from '../interfaces/athlete';

@Component({
  selector: 'app-athlete-select',
  template: `
    <mat-form-field class="w-100 input-headline">
      <input 
        type="text" 
        placeholder="Select Athlete" 
        aria-label="Athletes Name" 
        matInput 
        [formControl]="myControl" 
        [matAutocomplete]="auto" 
        (input)="onAthleteChange($event.target.value)">

      <mat-autocomplete 
        autoActiveFirstOption 
        #auto="matAutocomplete" 
        (optionSelected)='onAthleteChange($event.option.value)'>

      <mat-option
        *ngFor="let athlete of filteredAthletes | async" 
        [value]="athlete.first_name + ' ' + athlete.last_name">
        {{athlete.first_name}} {{athlete.last_name}}
      </mat-option>
      
      </mat-autocomplete>
    </mat-form-field>`,
  styles: [ ]
})

export class AthletesSelectComponent implements OnInit {
  @Output() selectedAthleteChange = new EventEmitter<Athlete>();

  protected myControl = new FormControl();
  protected filteredAthletes: Observable<Athlete[]>;

  protected athletes: Athlete[];
  protected selectedAthlete: Athlete;

  constructor(private data: DataService) { }

  ngOnInit() {

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

    return this.athletes.filter(
      option => (option.first_name.toLowerCase() + ' ' + option.last_name.toLowerCase()).indexOf(filterValue) === 0
    );
  }

  onAthleteChange(searchValue : string ) {  
    const currentAthlete = this.selectedAthlete; 
    for(let i=0; i<this.athletes.length; i++) {
      const athlete = this.athletes[i];
      if(athlete.first_name + ' ' + athlete.last_name === searchValue) {
        console.log('SETTING ATHLETE');
        this.selectedAthlete = athlete;
        break;
      } else {
        console.log('clear athlete');
        this.selectedAthlete = null;
      }
    }
    
    if(currentAthlete !== this.selectedAthlete) {
      this.selectedAthleteChange.emit(this.selectedAthlete);  
    }
  }
}