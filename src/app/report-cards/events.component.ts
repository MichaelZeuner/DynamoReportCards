import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Level } from '../interfaces/level';
import { Event } from '../interfaces/event';
import { DataService } from '../data.service';
import { Skill } from '../interfaces/skill';

@Component({
  selector: 'app-events',
  template: `
  <div *ngFor="let event of eventsInternal">
    <mat-divider></mat-divider>
    <h3 class="eventTitle" >{{event.name}}</h3>
    <app-skills [level]="level" [event]="event" (skills)="onSkillsRankChange($event, event)"></app-skills>
  </div>
  `,
  styles: [`
      .eventTitle {
        margin-bottom: 0;
        padding-top: 1rem;
    }
  `]
})
export class EventsComponent implements OnInit {
  @Input() public level: Level;
  @Output() events = new EventEmitter<Event[]>();
  private eventsInternal: Event[];

  //maybe take in a level object
  constructor(private data: DataService) { }

  ngOnInit() {
    console.log(this.level);

    this.data.getLevelEvents(this.level.id).subscribe((events: Event[]) => {
      console.log(events);
      this.eventsInternal = events;
    });
  }

  onSkillsRankChange(skills: Skill[], event: Event) {
    event.skills = skills;
    console.log(event);

    for(let i=0; i<this.eventsInternal.length; i++) {
      if(this.eventsInternal[i].id === event.id) {
        this.eventsInternal[i] = event;
        this.events.emit(this.eventsInternal);
        return;
      }
    }
  }
}
