import { Component, OnInit } from "@angular/core";
import { DataService } from "../data.service";
import { Level } from "../interfaces/level";
import { Event } from "../interfaces/event";
import { Skill } from "../interfaces/skill";
import { ReportCardSkill } from "../interfaces/report-card-skill";
import { DialogService } from "../shared/dialog.service";
import { Input } from "@angular/compiler/src/core";
import { MatInput, MatRadioChange } from "@angular/material";
import { ErrorApi } from "../interfaces/error-api";
import { LevelGroups } from "../interfaces/level-groups";
import { SelectDialogInput } from "../mat-select-dialog/select-dialog-input";
import { count } from "rxjs/operators";
import { SelectDialogOutput } from "../mat-select-dialog/select-dialog-output";
import { MainNavComponent } from "../main-nav/main-nav.component";

interface FullLevel extends Level {
  events: FullEvent[];
}

interface FullEvent extends Event {
  skills: Skill[];
}

const newLevelGroupDefault: SelectDialogOutput = {
  id: -1,
  value: "Select Level Group"
};

@Component({
  selector: "app-levels",
  templateUrl: "./levels.component.html",
  styleUrls: ["./levels.component.scss"]
})
export class LevelsComponent implements OnInit {
  public newLevelGroup: SelectDialogOutput = newLevelGroupDefault;
  public levels: FullLevel[] = [];
  public allEvents: Event[] = [];
  public allLevelGroups: LevelGroups[] = [];
  public levelGroupsToShow: number[] = [];

  constructor(
    private data: DataService,
    private dialog: DialogService,
    private nav: MainNavComponent
  ) {}

  ngOnInit() {
    this.nav.displayLoading = false;
    this.data.getLevelGroups().subscribe((levelGroups: LevelGroups[]) => {
      this.allLevelGroups = levelGroups;
      console.log(this.allLevelGroups);
    });

    this.data.getEvents().subscribe((events: Event[]) => {
      this.allEvents = events;
      console.log(this.allEvents);
    });
  }

  adjustDisplayedLevelGroups(event: MatRadioChange) {
    console.log(event);
    console.log("toggle display " + event.value);

    this.nav.displayLoading = true;
    this.data.getLevelsForGroupFull(event.value).subscribe((levels: FullLevel[]) => {
      console.log(levels);
      this.levels = levels;
      this.nav.displayLoading = false;
    });

    this.levelGroupsToShow = [event.value];
  }

  populateLevels(levels: Level[]) {
    for (let i = 0; i < levels.length; i++) {
      const level = levels[i];
      this.levels.push({
        id: level.id,
        name: level.name,
        level_number: level.level_number,
        level_groups_id: level.level_groups_id,
        events: []
      });

      this.data.getLevelEvents(level.id).subscribe(
        (events: Event[]) => {
          console.log("Events for level: " + level.id);
          console.log(events);
          this.populateEvents(i, events);
        },
        (err: ErrorApi) => {
          console.log(err.error.message);
          this.populateEvents(i, []);
        }
      );
    }

    console.log(this.levels);
  }

  populateEvents(currentLevel: number, events: Event[]) {
    const level = this.levels[currentLevel];
    let missingEvents: Event[] = [];
    Object.assign(missingEvents, this.allEvents);

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      this.levels[currentLevel].events.push({
        id: event.id,
        name: event.name,
        skills: []
      });

      for (let x = 0; x < this.allEvents.length; x++) {
        if (event.id === missingEvents[x].id) {
          missingEvents.splice(x, 1);
          break;
        }
      }

      const currentEvent = this.levels[currentLevel].events.length - 1;
      this.data
        .getEventSkills(level.id, event.id)
        .subscribe((skills: Skill[]) => {
          for (let x = 0; x < skills.length; x++) {
            const skill = skills[x];
            this.levels[currentLevel].events[currentEvent].skills.push(skill);
          }

          this.nav.displayLoading = false;
        });
    }

    for (let i = 0; i < missingEvents.length; i++) {
      const missingEvent = missingEvents[i];
      this.levels[currentLevel].events.push({
        id: missingEvent.id,
        name: missingEvent.name,
        skills: []
      });
    }
  }

  putLevel(level: Level) {
    console.log(level);
    this.data.putLevel(level).subscribe((data: Level) => {
      this.dialog.openSnackBar("Level Updated!", 3000);
      console.log(data);
    });
  }

  levelChanged(level: Level, newLevelNumber: number) {
    level.level_number = newLevelNumber;
    console.log(level);
    this.putLevel(level);
  }

  deleteLevel(levelToRemove: Level) {
    this.dialog
      .openConfirmDialog(
        'Are you sure you wish to remove the level "' +
          levelToRemove.name +
          '"?'
      )
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.data.deleteLevel(levelToRemove).subscribe(() => {
            for (let i = 0; i < this.levels.length; i++) {
              let level = this.levels[i];
              if (level.id === levelToRemove.id) {
                this.levels.splice(i, 1);
                this.dialog.openSnackBar("Level Deleted!");
                return;
              }
            }
          });
        }
      });
  }

  changeNewLevelGroup() {
    let levelSelectInput: SelectDialogInput = {
      label: "Select Level Group",
      options: []
    };
    for (let i = 0; i < this.allLevelGroups.length; i++) {
      levelSelectInput.options.push({
        id: this.allLevelGroups[i].id,
        value: this.allLevelGroups[i].name
      });
    }
    this.dialog
      .openSelectDialog(levelSelectInput)
      .afterClosed()
      .subscribe(res => {
        console.log(res);
        if (res) {
          let result: SelectDialogOutput = res;
          console.log(result.id);
          console.log(result.value);
          this.newLevelGroup = result;
        }
      });
  }

  addLevel(levelNumber: MatInput) {
    if (this.newLevelGroup.id === newLevelGroupDefault.id) {
      this.dialog.openSnackBar("Please select a level group first.", 3000);
      return;
    } else if (levelNumber.value === "") {
      this.dialog.openSnackBar("Please select a level number first.", 3000);
      return;
    }

    this.data
      .addLevel({
        level_groups_id: this.newLevelGroup.id,
        level_number: parseInt(levelNumber.value)
      })
      .subscribe((data: Level) => {
        console.log(data);
        this.levels.push({
          id: data.id,
          name: this.newLevelGroup.value,
          level_groups_id: data.level_groups_id,
          level_number: data.level_number,
          events: []
        });
        this.newLevelGroup = newLevelGroupDefault;
        this.populateEvents(this.levels.length - 1, []);
      });
  }

  skillChanged(skill: Skill, event: Event, level: Level, newName: string) {
    let reportCardSkill: ReportCardSkill = {
      id: skill.id,
      name: newName,
      events_id: event.id,
      levels_id: level.id
    };

    console.log(reportCardSkill);
    this.data.putSkill(reportCardSkill).subscribe((data: ReportCardSkill) => {
      this.dialog.openSnackBar("Skill Updated!", 3000);
      console.log(data);
    });
  }

  deleteSkill(skillToRemove: Skill) {
    this.dialog
      .openConfirmDialog(
        'Are you sure you wish to remove the skill "' +
          skillToRemove.name +
          '"?'
      )
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.data.deleteSkill(skillToRemove).subscribe(() => {
            for (let i = 0; i < this.levels.length; i++) {
              let level = this.levels[i];
              for (let x = 0; x < level.events.length; x++) {
                let event = level.events[x];
                for (let y = 0; y < event.skills.length; y++) {
                  let skill = event.skills[y];
                  if (skill.id === skillToRemove.id) {
                    this.levels[i].events[x].skills.splice(y, 1);
                    this.dialog.openSnackBar("Skill Deleted!");
                    return;
                  }
                }
              }
            }
            this.dialog.openSnackBar("Skill was not found...");
          });
        }
      });
  }

  addSkill(newSkill: MatInput, event: Event, level: Level) {
    let skill: ReportCardSkill = {
      events_id: event.id,
      levels_id: level.id,
      name: newSkill.value
    };
    console.log(skill);
    this.data.addSkill(skill).subscribe(
      (data: Skill) => {
        this.dialog.openSnackBar(
          data.name + " has been added to " + event.name + " for " + level.name
        );
        for (let i = 0; i < this.levels.length; i++) {
          const currentLevel = this.levels[i];
          if (currentLevel.id === level.id) {
            for (let x = 0; x < currentLevel.events.length; x++) {
              if (currentLevel.events[x].id === event.id) {
                this.levels[i].events[x].skills.push(data);
                newSkill.value = "";
                return;
              }
            }

            let newSkills: Skill[] = [];
            newSkills.push(data);
            this.levels[i].events.push({
              id: event.id,
              name: event.name,
              skills: newSkills
            });
          }
        }
      },
      (error: ErrorApi) => {
        console.log(error);
      }
    );
  }

  changeLevelGroup(level: Level) {
    let levelSelectInput: SelectDialogInput = {
      label: "Select Level Group",
      options: []
    };
    for (let i = 0; i < this.allLevelGroups.length; i++) {
      levelSelectInput.options.push({
        id: this.allLevelGroups[i].id,
        value: this.allLevelGroups[i].name
      });
    }
    this.dialog
      .openSelectDialog(levelSelectInput)
      .afterClosed()
      .subscribe(res => {
        console.log(res);
        if (res) {
          let result: SelectDialogOutput = res;
          console.log(result.id);
          console.log(result.value);
          for (let i = 0; i < this.levels.length; i++) {
            if (this.levels[i].id === level.id) {
              this.levels[i].level_groups_id = result.id;
              this.levels[i].name = result.value;

              console.log(this.levels[i]);
              this.data.putLevel(this.levels[i]).subscribe((data: Level) => {
                this.dialog.openSnackBar("Level Updated!", 3000);
                console.log(data);
              });
            }
          }
        }
      });
  }
}
