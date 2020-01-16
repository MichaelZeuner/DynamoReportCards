import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges
} from "@angular/core";
import { Level } from "../interfaces/level";
import { Event } from "../interfaces/event";
import { DataService } from "../data.service";
import { Skill } from "../interfaces/skill";
import { ReportCard } from "../interfaces/report-card";
import { ReportCardCompleted } from "../interfaces/report-card-completed";

@Component({
  selector: "app-report-card-events",
  template: `
  <table class="w-100">
    <tr>
      <td>
        <h2 *ngIf="levelSecond !== null">{{level.name}} Level {{level.level_number}}</h2>
        <div *ngFor="let event of eventsInternal">
          <mat-divider></mat-divider>
          <h3 class="eventTitle">{{ event.name }}</h3>
          <app-skills
            [level]="level"
            [event]="event"
            [reportCard]="reportCard"
            (skills)="onSkillsRankChange($event, event)"
          ></app-skills>
        </div>
      </td>
      <td *ngIf="levelSecond !== null">
        <h2>{{levelSecond.name}} Level {{levelSecond.level_number}}</h2>
        <div *ngFor="let event of eventsInternalSecond">
          <mat-divider></mat-divider>
          <h3 class="eventTitle">{{ event.name }}</h3>
          <app-skills
            [level]="levelSecond"
            [event]="event"
            [reportCard]="reportCardSecond"
            (skills)="onSkillsRankChangeSecond($event, event)"
          ></app-skills>
        </div>
      </td>
    </tr>
  </table>
  `,
  styles: [
    `
      .eventTitle {
        margin-bottom: 0;
        padding-top: 1rem;
      }
    `
  ]
})
export class ReportCardEventsComponent implements OnInit {
  @Input() public level: Level;
  @Input() reportCard: ReportCardCompleted;
  @Output() events = new EventEmitter<Event>();
  public eventsInternal: Event[];

  @Input() public levelSecond: Level = null;
  @Input() reportCardSecond: ReportCardCompleted;
  @Output() eventsSecond = new EventEmitter<Event>();
  public eventsInternalSecond: Event[];

  constructor(private data: DataService) {}

  ngOnInit() {}

  async ngOnChanges(changes: SimpleChanges) {
    try {
      for (let propName in changes) {
        if (propName === "level") {
          console.log("New Level", changes[propName].currentValue);
          this.level = changes[propName].currentValue;
          this.eventsInternal = await this.setLevel(this.level);
          console.log("events", this.eventsInternal);
        }
        if (propName === "levelSecond") {
          console.log("New Level Second", changes[propName].currentValue);
          this.levelSecond = changes[propName].currentValue;
          if(this.levelSecond != null) {
            this.eventsInternalSecond = await this.setLevel(this.levelSecond);
            console.log("events second", this.eventsInternalSecond);
          }
        }
      }
    } catch(e) {
      console.error(e);
    }
  }

  async setLevel(level: Level): Promise<Event[]> {
    let eventsInt: Event[] = await this.data.getLevelEvents(level.id).toPromise();
    if (typeof level.events !== "undefined") {
      for (let i = 0; i < level.events.length; i++) {
        for (let x = 0; x < eventsInt.length; x++) {
          if (eventsInt[x].id === level.events[i].id) {
            eventsInt[x] = level.events[i];
            break;
          }
        }
      }
    }
    return eventsInt;
  }

  onSkillsRankChange(skills: Skill[], event: Event) {
    event.skills = skills;

    for (let i = 0; i < this.eventsInternal.length; i++) {
      if (this.eventsInternal[i].id === event.id) {
        this.eventsInternal[i] = event;
        this.events.emit(event);
        return;
      }
    }
  }

  onSkillsRankChangeSecond(skills: Skill[], event: Event) {
    event.skills = skills;

    for (let i = 0; i < this.eventsInternalSecond.length; i++) {
      if (this.eventsInternalSecond[i].id === event.id) {
        this.eventsInternalSecond[i] = event;
        this.eventsSecond.emit(event);
        return;
      }
    }
  }
}
