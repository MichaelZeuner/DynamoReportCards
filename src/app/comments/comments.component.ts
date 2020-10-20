import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { DataService } from "../data.service";
import { Level } from "../interfaces/level";
import { ErrorApi } from "../interfaces/error-api";
import { DialogService } from "../shared/dialog.service";
import { element } from "@angular/core/src/render3";
import { Comments } from "../interfaces/comments";
import { CommonService } from "../shared/common.service";
import { MainNavComponent } from "../main-nav/main-nav.component";
import { MatRadioChange, PageEvent } from "@angular/material";
import { LevelGroups } from '../interfaces/level-groups';

@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.scss"]
})
export class CommentsComponent implements OnInit {
  NEW_COMMENT: number = -1;

  NEW_COMMENT_OBJ: Comments = {
    id: this.NEW_COMMENT,
    comment: "",
    levels: [],
    type: ""
  };

  commentTypes: any[] = [
    { id: "INTRO", name: "Intro" },
    { id: "SKILL", name: "Skill/Goal" },
    { id: "CLOSING", name: "Closing" },
    { id: "PERSONALITY_BRAVE", name: "Personality: Brave" },
    { id: "PERSONALITY_ENERGY", name: "Personality: Energy" },
    { id: "PERSONALITY_GENERAL", name: "Personality: General" },
    { id: "PERSONALITY_STRENGTH", name: "Personality: Strength" },
    { id: "PERSONALITY_SOCIAL", name: "Personality: Social" }
  ];

  comments: Comments[] = [];
  commentsDisplayed: Comments[] = [];
  levels: Level[] = [];

  levelGroups = [];

  public pageinatorIndex: number = 0;
  public pageinatorSize: number = 10;
  public allLevelGroups: LevelGroups[] = [];

  constructor(
    public data: DataService,
    public dialog: DialogService,
    public comm: CommonService,
    public nav: MainNavComponent
  ) {}

  ngOnInit() {
    this.createLevelGroupArray();
    this.nav.displayLoading = true;

    this.data.getLevelGroups().subscribe((levelGroups: LevelGroups[]) => {
      this.allLevelGroups = levelGroups;
      console.log(this.allLevelGroups);
    });

    this.data.getComments().subscribe(
      (data: Comments[]) => {
        this.nav.displayLoading = false;
        this.comments.push(this.comm.deepCopy(this.NEW_COMMENT_OBJ));
        for (let i = 0; i < data.length; i++) {
          this.comments.push(data[i]);
        }
        console.log(this.comments);
        this.refreshPage();
      },
      (err: ErrorApi) => {
        console.error(err);
        this.dialog.openSnackBar(err.error.message);
      }
    );
  }

  search(searchText: string) {
    console.log(searchText);
    let newData = [];
    this.nav.displayLoading = true;
    for(let i=0; i<this.comments.length; i++) {
      if(this.comments[i].comment.toLowerCase().indexOf(searchText.toLowerCase()) >= 0 ){
        newData.push(this.comments[i]);
      }
    }
    console.log(newData);
    this.commentsDisplayed = newData;
    this.nav.displayLoading = false;

  }

  adjustDisplayedLevelGroups(event: MatRadioChange) {
    console.log(event);
    console.log("toggle display " + event.value);

    this.nav.displayLoading = true;
    this.data.getCommentsForGroup(event.value).subscribe((comments: Comments[]) => {
      console.log(comments);
      this.comments = [];
      this.comments.push(this.comm.deepCopy(this.NEW_COMMENT_OBJ));
      for (let i = 0; i < comments.length; i++) {
        this.comments.push(comments[i]);
      }
      console.log(this.comments);
      this.refreshPage();
      this.nav.displayLoading = false;
    });
  }

  createLevelGroupArray() {
    this.nav.displayLoading = true;
    this.data.getLevels().subscribe(
      (data: Level[]) => {
        this.nav.displayLoading = false;
        this.levels = data;
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

  addLevel(commentId: number, levelId: number) {
    for (let i = 0; i < this.comments.length; i++) {
      if (this.comments[i].id === commentId) {
        ///ALL
        if (levelId === 0) {
          this.comments[i].levels = [];
          return;
        }

        //level is already in the comment
        for (let x = 0; x < this.comments[i].levels.length; x++) {
          if (this.comments[i].levels[x].id === levelId) {
            return;
          }
        }

        //add level to the comment
        for (let x = 0; x < this.levels.length; x++) {
          if (this.levels[x].id === levelId) {
            this.comments[i].levels.push(this.levels[x]);
          }
        }

        if (this.comments[i].id !== this.NEW_COMMENT) {
          this.putComment(commentId);
        }
        return;
      }
    }
  }

  removeLevel(commentId: number, levelId: number) {
    for (let i = 0; i < this.comments.length; i++) {
      if (this.comments[i].id === commentId) {
        for (let x = 0; x < this.comments[i].levels.length; x++) {
          if (this.comments[i].levels[x].id === levelId) {
            this.comments[i].levels.splice(x, 1);
            if (this.comments[i].id !== this.NEW_COMMENT) {
              this.putComment(commentId);
            }
            return;
          }
        }
      }
    }
  }

  putComment(commentId: number) {
    console.log("does this get called?");
    for (let i = 0; i < this.comments.length; i++) {
      if (this.comments[i].id === commentId) {
        const commentToPut = this.comments[i];
        console.log(commentToPut);
        this.nav.displayLoading = true;
        this.data.putComment(commentToPut).subscribe(
          (data: Comments[]) => {
            this.nav.displayLoading = false;
            console.log(data);
            this.dialog.openSnackBar("Comment Updated!");
          },
          (err: ErrorApi) => {
            console.error(err);
            this.dialog.openSnackBar(err.message);
          }
        );
      }
    }
  }

  async deleteComment(commentId: number) {
    console.log('delte ' + commentId);
    let confirm = await this.dialog.openConfirmDialog("Are you sure you wish to delete the comment?").afterClosed().toPromise()
    if(confirm) {
      let res = await this.data.deleteComment(commentId).toPromise();
      console.log('deteled', res);

      for (let i = 0; i < this.commentsDisplayed.length; i++) {
        if(this.commentsDisplayed[i].id == commentId) {
          this.commentsDisplayed.splice(i, 1);
          return;
        }
      }
    }
  }

  addNewComment() {
    console.log(this.comments[0]);
    if (this.comments[0].type === "") {
      this.dialog.openSnackBar("Select a type for the comment before adding.");
      return;
    }
    if (this.comments[0].comment === "") {
      this.dialog.openSnackBar("Enter some comment before adding.");
      return;
    }

    this.nav.displayLoading = true;
    this.data.addComment(this.comments[0]).subscribe(
      (data: Comments) => {
        this.nav.displayLoading = false;
        console.log("Added Comment:");
        console.log(data);
        this.comments.push(data);
        this.dialog.openSnackBar("Comment Added!");
        this.comments[0] = this.comm.deepCopy(this.NEW_COMMENT_OBJ);
      },
      (err: ErrorApi) => {
        console.error(err);
        this.dialog.openSnackBar(err.message);
      }
    );
  }

  addElementToComment(
    commentInputId: string,
    element: string,
    commentId: number
  ) {
    let commentInput: HTMLInputElement = <HTMLInputElement>(
      document.getElementById(commentInputId)
    );
    commentInput.value += element;

    for (let i = 0; i < this.comments.length; i++) {
      if (this.comments[i].id === commentId) {
        this.comments[i].comment = commentInput.value;
        if (commentId !== this.NEW_COMMENT) {
          this.putComment(commentId);
        }
        return;
      }
    }
  }

  addAthleteName(commentInputId: string, commentId: number) {
    this.addElementToComment(commentInputId, this.comm.COMMENT_NAME, commentId);
  }

  addEvent(commentInputId: string, commentId: number) {
    this.addElementToComment(
      commentInputId,
      this.comm.COMMENT_EVENT,
      commentId
    );
  }

  addSkill(commentInputId: string, commentId: number) {
    this.addElementToComment(
      commentInputId,
      this.comm.COMMENT_SKILL,
      commentId
    );
  }

  refreshPage() {
    this.pageinatorIndex = 0;
    this.pageChanged(null);
  }

  pageChanged(event: PageEvent) {
    const startingIndex: number =
      event !== null ? event.pageIndex * event.pageSize : 0;
    let endingIndex: number =
      event !== null
        ? (event.pageIndex + 1) * event.pageSize
        : this.pageinatorSize;
    if (endingIndex > this.comments.length) {
      endingIndex = this.comments.length;
    }

    this.commentsDisplayed = [];
    for (let i = startingIndex; i < endingIndex; i++) {
      this.commentsDisplayed.push(this.comments[i]);
    }
  }
}
