import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild
} from "@angular/core";
import { Level } from "src/app/interfaces/level";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { DataService } from "src/app/data.service";
import { startWith, map } from "rxjs/operators";
import { MatAutocompleteTrigger } from "@angular/material";

@Component({
  selector: "app-level-select",
  template: `
    <mat-form-field class="w-100 input-headline">
      <input
        #levelName
        type="text"
        placeholder="Select Level"
        aria-label="Level Name"
        matInput
        [formControl]="myControlLevel"
        [matAutocomplete]="autoLevel"
        (input)="onLevelChange($event.target.value)"
      />

      <mat-autocomplete
        autoActiveFirstOption
        #autoLevel="matAutocomplete"
        (optionSelected)="onLevelChange($event.option.value)"
      >
        <mat-option
          *ngFor="let levelFilter of filteredLevels | async"
          [value]="getLevelToString(levelFilter)"
        >
          {{ getLevelToString(levelFilter) }}
        </mat-option>
      </mat-autocomplete>
    </mat-form-field>
  `,
  styles: []
})
export class LevelSelectComponent implements OnInit {
  @Output() levelChange = new EventEmitter<Level>();
  @ViewChild("levelName") levelName;
  @ViewChild(MatAutocompleteTrigger) _auto: MatAutocompleteTrigger;

  public myControlLevel = new FormControl();
  public filteredLevels: Observable<Level[]>;

  protected levels: Level[];

  constructor(private data: DataService) {}

  protected previousLevel: Level = null;
  protected _level: Level = null;

  @Input()
  set enabled(enabled: Boolean) {
    if (enabled) {
      this.myControlLevel.enable();
    } else {
      this.myControlLevel.disable();
    }
  }

  @Input()
  set level(level: Level) {
    this.previousLevel = this._level;
    if (typeof level === "undefined") {
      this._level = null;
    } else {
      this._level = level;
      this.myControlLevel.setValue(this.getLevelToString(level));
    }
  }

  get levelNameForInput(): string {
    if (this.previousLevel !== this._level) {
      return this.getLevelToString(this._level);
    } else {
      return this.myControlLevel.value;
    }
  }

  getLevelToString(level: Level) {
    if(level !== null) {
      return level.name + " Level " + level.level_number;
    } else {
      return "";
    }
  }

  ngOnInit() {
    this.myControlLevel.valueChanges.subscribe(data => {
      console.log(data);
    });

    this.data.getLevels().subscribe((data: Level[]) => {
      this.levels = data;
      this.filteredLevels = this.myControlLevel.valueChanges.pipe(
        startWith(""),
        map(value => this._filter(value))
      );
    });
  }

  private _filter(value: string): Level[] {
    const filterValue = value !== null ? value.toLowerCase() : "";
    console.log("filter value", filterValue);

    return this.levels.filter(
      option =>
        this.getLevelToString(option)
          .toLowerCase()
          .indexOf(filterValue) === 0
    );
  }

  public clearLevel() {
    this.levelName.nativeElement.value = "";
    this.onLevelChange("");
  }

  onLevelChange(searchValue: string) {
    const currentLevel = this._level;
    for (let i = 0; i < this.levels.length; i++) {
      const level = this.levels[i];
      if (this.getLevelToString(level) === searchValue) {
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
