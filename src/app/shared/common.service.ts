import { Injectable } from "@angular/core";
import { stringify } from "@angular/core/src/render3/util";
import { Comments } from "../interfaces/comments";

@Injectable({
  providedIn: "root"
})
export class CommonService {
  constructor() {}

  public COMMENT_NAME: string = "~!NAME!~";
  public COMMENT_EVENT: string = "~!EVENT!~";
  public COMMENT_SKILL: string = "~!SKILL!~";

  deepCopy(input: any): any {
    return JSON.parse(JSON.stringify(input));
  }

  replaceComment(
    comment: string,
    athlete: string,
    event: string,
    skill: string
  ): string {
    if (typeof event === "undefined" || typeof skill === "undefined") {
      event = "";
      skill = "";
    }

    return comment
      .replace(new RegExp(this.COMMENT_NAME, "g"), athlete)
      .replace(
        new RegExp(this.COMMENT_SKILL, "g"),
        skill.replace(/\(.*\)/g, "").toLowerCase()
      )
      .replace(new RegExp(this.COMMENT_EVENT, "g"), event.toLowerCase());
  }

  updateComments(
    commentsBase: Comments[],
    level_id: number,
    athlete: string,
    event: string,
    skill: string
  ): Comments[] {
    let commentsActive: Comments[] = this.deepCopy(commentsBase);

    for (let i = commentsBase.length - 1; i >= 0; i--) {
      let commentForLevel = false;
      for (let x = commentsBase[i].levels.length - 1; x >= 0; x--) {
        if (commentsBase[i].levels[x].id === level_id) {
          commentForLevel = true;
        }
      }
      if (commentsBase[i].levels.length === 0) {
        commentForLevel = true;
      }
      if (commentForLevel) {
        commentsActive[i].comment = this.replaceComment(
          commentsBase[i].comment,
          athlete,
          event,
          skill
        );
      } else {
        commentsActive.splice(i, 1);
      }
    }

    return commentsActive;
  }
}
