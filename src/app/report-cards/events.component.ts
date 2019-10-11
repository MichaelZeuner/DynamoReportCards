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

  constructor(private data: DataService) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      if (propName === "level") {
        console.log("New Level", changes[propName].currentValue);
        this.level = changes[propName].currentValue;
        this.setLevel();
      }
    }
  }

  setLevel() {
    this.data.getLevelEvents(this.level.id).subscribe((events: Event[]) => {
      this.eventsInternal = events;
      if (typeof this.level.events !== "undefined") {
        for (let i = 0; i < this.level.events.length; i++) {
          for (let x = 0; x < this.eventsInternal.length; x++) {
            if (this.eventsInternal[x].id === this.level.events[i].id) {
              this.eventsInternal[x] = this.level.events[i];
              break;
            }
          }
        }
      }
    });
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
}
