import { DataService } from "../data.service";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { Athlete } from "../interfaces/athlete";

@Component({
  selector: "app-athlete-select",
  template: `
    <mat-form-field class="w-100 input-headline">
      <input
        #athleteName
        type="text"
        placeholder="Select Athlete"
        aria-label="Athletes Name"
        matInput
        [value]="athleteNameForInput"
        [formControl]="myControlAthlete"
        [matAutocomplete]="auto"
        (input)="onAthleteChange($event.target.value)"
      />

      <mat-autocomplete
        autoActiveFirstOption
        #auto="matAutocomplete"
        (optionSelected)="onAthleteChange($event.option.value)"
      >
        <mat-option
          *ngFor="let athleteFilter of filteredAthletes | async"
          [value]="getAthleteNameAndDate(athleteFilter)"
        >
          {{ getAthleteNameAndDate(athleteFilter) }}
        </mat-option>
      </mat-autocomplete>
    </mat-form-field>
  `,
  styles: []
})
export class AthletesSelectComponent implements OnInit {
  @Output() selectedAthleteChange = new EventEmitter<Athlete>();
  @ViewChild("athleteName") athleteName;

  public myControlAthlete = new FormControl();
  public filteredAthletes: Observable<Athlete[]>;

  protected athletes: Athlete[];

  constructor(private data: DataService) {}

  protected previousAthlete: Athlete = null;
  protected _athlete: Athlete = null;

  @Input()
  set enabled(enabled: Boolean) {
    if (enabled) {
      this.myControlAthlete.enable();
    } else {
      this.myControlAthlete.disable();
    }
  }

  @Input()
  set athlete(athlete: Athlete) {
    this.previousAthlete = this._athlete;
    if (typeof athlete === "undefined") {
      this._athlete = null;
    } else {
      this._athlete = athlete;
    }
  }

  get athleteNameForInput(): string {
    if (this.previousAthlete !== this._athlete) {
      if (this._athlete !== null) {
        return this.getAthleteNameAndDate(this._athlete);
      } else {
        return "";
      }
    } else {
      return this.myControlAthlete.value;
    }
  }

  getAge(dateOfBirthStr: string): string {
    const dateOfBirth: Date = new Date(dateOfBirthStr);
    const ageDifMs = Date.now() - dateOfBirth.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970).toString();
  }

  getAthleteNameAndDate(athlete: Athlete) {
    return (
      athlete.first_name +
      " " +
      athlete.last_name +
      " (" +
      this.getAge(athlete.date_of_birth) +
      ": " +
      athlete.date_of_birth +
      ")"
    );
  }

  ngOnInit() {
    this.data.getAthletes().subscribe((data: Athlete[]) => {
      this.athletes = data;

      this.filteredAthletes = this.myControlAthlete.valueChanges.pipe(
        startWith(""),
        map(value => this._filter(value))
      );
    });
  }

  private _filter(value: string): Athlete[] {
    const filterValue = value !== null ? value.toLowerCase() : "";
    console.log("filter value", filterValue);

    return this.athletes.filter(
      option =>
        this.getAthleteNameAndDate(option)
          .toLowerCase()
          .indexOf(filterValue) === 0
    );
  }

  public clearAthlete() {
    this.myControlAthlete.setValue("");
    this.onAthleteChange("");
  }

  onAthleteChange(searchValue: string) {
    const currentAthlete = this._athlete;
    for (let i = 0; i < this.athletes.length; i++) {
      const athlete = this.athletes[i];
      if (this.getAthleteNameAndDate(athlete) === searchValue) {
        this._athlete = athlete;
        break;
      } else {
        this._athlete = null;
      }
    }

    if (currentAthlete !== this._athlete) {
      this.selectedAthleteChange.emit(this._athlete);
    }
  }
}
