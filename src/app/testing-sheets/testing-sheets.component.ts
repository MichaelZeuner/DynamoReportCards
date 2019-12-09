import { Component, OnInit, ViewChild } from "@angular/core";
import { Athlete } from "../interfaces/athlete";
import { DataService } from "../data.service";
import { ErrorApi } from "../interfaces/error-api";
import { DialogService } from "../shared/dialog.service";
import { Level } from "../interfaces/level";
import { MainNavComponent } from "../main-nav/main-nav.component";
import { AthletesSelectComponent } from "../report-cards/athlete-select.component";

interface PreviousLevel {
  id: number;
  name: string;
  level_number: number;
  next_level_id: number;
  next_level_number: number;
  status: string;
}

interface TestingSheetAthlete {
  athlete_id: number;
  name: string;
  level: Level;
}

@Component({
  selector: "app-testing-sheets",
  templateUrl: "./testing-sheets.component.html",
  styleUrls: ["./testing-sheets.component.scss"]
})
export class TestingSheetsComponent implements OnInit {
  @ViewChild("athleteSelect") athleteSelect: AthletesSelectComponent;

  public curAthlete: Athlete = null;
  public prevLevel: PreviousLevel = null;
  public selectedLevelId: number;
  public addedAthletes: TestingSheetAthlete[] = [];

  levelGroups = [];

  constructor(
    public data: DataService,
    public dialog: DialogService,
    public nav: MainNavComponent
  ) {}

  ngOnInit() {
    this.createLevelGroupArray();
  }

  createLevelGroupArray() {
    this.nav.displayLoading = true;
    this.data.getLevels().subscribe(
      (data: Level[]) => {
        this.nav.displayLoading = false;
        for (let i = 0; i < data.length; i++) {
          let groupFound = false;
          for (let j = 0; j < this.levelGroups.length; j++) {
            if (this.levelGroups[j].id === data[i].level_groups_id) {
              groupFound = true;
              this.levelGroups[j].levels.push(
                this.levelObj(data[i].id, data[i].level_number)
              );
            }
          }

          if (!groupFound) {
            this.levelGroups.push(
              this.levelGroupObj(
                data[i].level_groups_id,
                data[i].name,
                data[i].id,
                data[i].level_number
              )
            );
          }
        }
        console.log(this.levelGroups);
      },
      (err: ErrorApi) => {
        console.error(err);
        this.dialog.openSnackBar(err.error.message);
      }
    );
  }

  levelGroupObj(
    level_groups_id: number,
    name: string,
    level_id: number,
    level_number: number
  ) {
    return {
      id: level_groups_id,
      name: name,
      levels: [this.levelObj(level_id, level_number)]
    };
  }

  levelObj(level_id: number, level_number: number) {
    return {
      id: level_id,
      number: level_number
    };
  }

  updateSelectAthlete(newAthlete: Athlete) {
    this.curAthlete = newAthlete;
    if (newAthlete != null) {
      this.data.getPreviousAthleteLevel(newAthlete.id).subscribe(
        (data: PreviousLevel) => {
          console.log(data);
          this.prevLevel = data;
        },
        (err: ErrorApi) => {
          console.log("no previous report card");
          this.prevLevel = null;
        }
      );
    } else {
      this.prevLevel = null;
    }
  }

  async addAthleteToList() {
    for (let i = 0; i < this.addedAthletes.length; i++) {
      if (this.addedAthletes[i].athlete_id === this.curAthlete.id) {
        return;
      }
    }

    let level: Level;
    if (this.prevLevel === null) {
      let levels: Level[] = await this.data.getLevels().toPromise();
      for (let i = 0; i < levels.length; i++) {
        if (this.selectedLevelId === levels[i].id) {
          level = levels[i];
        }
      }
    } else {
      if (this.prevLevel.status === "Completed") {
        level = {
          id: this.prevLevel.next_level_id,
          name: this.prevLevel.name,
          level_number: this.prevLevel.next_level_number
        };
      } else {
        level = {
          id: this.prevLevel.id,
          name: this.prevLevel.name,
          level_number: this.prevLevel.level_number
        };
      }
    }

    console.log(this.curAthlete);
    this.addedAthletes.push({
      athlete_id: this.curAthlete.id,
      name: this.curAthlete.first_name + " " + this.curAthlete.last_name,
      level: level
    });
    console.log(this.addedAthletes);

    this.athleteSelect.clearAthlete();
  }

  removeAthlete(athlete: TestingSheetAthlete) {
    for (let i = 0; i < this.addedAthletes.length; i++) {
      if (athlete == this.addedAthletes[i]) {
        this.addedAthletes.splice(i, 1);
        return;
      }
    }
  }
}
