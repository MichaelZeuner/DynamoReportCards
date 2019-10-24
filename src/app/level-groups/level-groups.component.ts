import { Component, OnInit } from "@angular/core";
import { DataService } from "../data.service";
import { DialogService } from "../shared/dialog.service";
import { LevelGroups } from "../interfaces/level-groups";
import { MatInput } from "@angular/material";
import { ErrorApi } from "../interfaces/error-api";
import { MainNavComponent } from "../main-nav/main-nav.component";

@Component({
  selector: "app-level-groups",
  templateUrl: "./level-groups.component.html",
  styleUrls: ["./level-groups.component.scss"]
})
export class LevelGroupsComponent implements OnInit {
  public levelGroups: LevelGroups[] = [];

  constructor(
    private data: DataService,
    private dialog: DialogService,
    private nav: MainNavComponent
  ) {}

  ngOnInit() {
    this.nav.displayLoading = true;
    this.data.getLevelGroups().subscribe((groups: LevelGroups[]) => {
      this.nav.displayLoading = false;
      this.levelGroups = groups;
      console.log(this.levelGroups);
    });
  }

  deleteGroup(levelGroupToRemove: LevelGroups) {
    this.dialog
      .openConfirmDialog(
        'Are you sure you wish to remove the level group "' +
          levelGroupToRemove.name +
          '"?'
      )
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.nav.displayLoading = true;
          this.data.deleteLevelGroup(levelGroupToRemove).subscribe(() => {
            this.nav.displayLoading = false;
            for (let i = 0; i < this.levelGroups.length; i++) {
              let levelGroup = this.levelGroups[i];
              if (levelGroup.id === levelGroupToRemove.id) {
                this.levelGroups.splice(i, 1);
                this.dialog.openSnackBar("Level Group Deleted!");
                return;
              }
            }
          });
        }
      });
  }

  addLevelGroup(newLevelGroup: MatInput) {
    const levelGroup: LevelGroups = {
      name: newLevelGroup.value
    };

    this.nav.displayLoading = true;
    this.data.addLevelGroup(levelGroup).subscribe(
      (data: LevelGroups) => {
        this.nav.displayLoading = false;
        this.dialog.openSnackBar(data.name + " has been added!");
        this.levelGroups.push(data);
        newLevelGroup.value = "";
      },
      (error: ErrorApi) => {
        console.log(error);
      }
    );
  }

  levelGroupChanged(levelGroup: LevelGroups, newName: string) {
    levelGroup.name = newName;

    console.log(levelGroup);
    this.nav.displayLoading = true;
    this.data.putLevelGroup(levelGroup).subscribe((data: LevelGroups) => {
      this.nav.displayLoading = false;
      this.dialog.openSnackBar("Level Group Updated!", 3000);
      console.log(data);
    });
  }
}
