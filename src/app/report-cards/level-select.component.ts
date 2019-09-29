import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Inject,
  Input,
  ViewChild
} from "@angular/core";
import { Level } from "src/app/interfaces/level";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { DataService } from "src/app/data.service";
import { startWith, map } from "rxjs/operators";

@Component({
  selector: "app-level-select",
  template: `
    <mat-form-field class="w-100 input-headline">
      <input
        type="text"
        placeholder="Select Level"
        aria-label="Level Name"
        matInput
        [(ngModel)]="levelNameForInput"
        [formControl]="myControl"
        [matAutocomplete]="auto"
        (input)="onLevelChange($event.target.value)"
      />

      <mat-autocomplete
        autoActiveFirstOption
        #auto="matAutocomplete"
        (optionSelected)="onLevelChange($event.option.value)"
      >
        <mat-option
          *ngFor="let level of filteredLevels | async"
          [value]="level.name + ' Level ' + level.level_number"
        >
          {{ level.name }} Level {{ level.level_number }}
        </mat-option>
      </mat-autocomplete>
    </mat-form-field>
  `,
  styles: []
})
export class LevelSelectComponent {
  @Output() levelChange = new EventEmitter<Level>();

  protected previousLevel: Level = null;
  protected _level: Level = null;

  @Input()
  set enabled(enabled: Boolean) {
    if (enabled) {
      this.myControl.enable();
    } else {
      this.myControl.disable();
    }
  }

  @Input()
  set level(level: Level) {
    this._level = level;
    if (typeof level === "undefined") {
      this._level = null;
    } else {
      this._level = level;
    }
  }

  get levelNameForInput(): string {
    if (this.previousLevel !== this._level) {
      if (this._level !== null) {
        return this._level.name + " Level " + this._level.level_number;
      } else {
        return "";
      }
    } else {
      return this.myControl.value;
    }
  }

  public myControl = new FormControl();
  public filteredLevels: Observable<Level[]>;

  protected levels: Level[];

  constructor(private data: DataService) {
    this.data.getLevels().subscribe((data: Level[]) => {
      this.levels = data;
      this.filteredLevels = this.myControl.valueChanges.pipe(
        startWith(""),
        map(value => this._filter(value))
      );
    });
  }

  private _filter(value: string): Level[] {
    const filterValue = value.toLowerCase();

    return this.levels.filter(
      option =>
        (option.name.toLowerCase() + " level " + option.level_number).indexOf(
          filterValue
        ) === 0
    );
  }

  onLevelChange(searchValue: string) {
    const currentLevel = this._level;
    for (let i = 0; i < this.levels.length; i++) {
      const level = this.levels[i];
      const fullName = level.name + " Level " + level.level_number;
      if (fullName === searchValue) {
        this._level = level;
        break;
      } else {
        this._level = null;
      }
    }

    if (currentLevel !== this._level) {
      this.levelChange.emit(this._level);
    }
  }
}
