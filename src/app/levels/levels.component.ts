import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Level } from '../interfaces/level';
import { Event } from '../interfaces/event';
import { Skill } from '../interfaces/skill';
import { ReportCardSkill } from '../interfaces/report-card-skill';
import { DialogService } from '../shared/dialog.service';
import { Input } from '@angular/compiler/src/core';
import { MatInput } from '@angular/material';
import { ErrorApi } from '../interfaces/error-api';

interface FullLevel extends Level {
  events: FullEvent[];
}

interface FullEvent extends Event {
  skills: Skill[];
}

@Component({
  selector: 'app-levels',
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.scss']
})
export class LevelsComponent implements OnInit {

  public levels: FullLevel[] = [];

  constructor(private data: DataService, private dialog: DialogService) { }

  ngOnInit() {
    this.data.getLevels().subscribe(
      (levels: Level[]) => {
        this.populateLevels(levels);
      }
    );
  }

  populateLevels(levels: Level[]) {
    for(let i=0; i<levels.length; i++) {
      const level = levels[i];
      this.levels.push({
        id: level.id,
        name: level.name,
        events: []
      });

      this.data.getLevelEvents(level.id).subscribe(
        (events: Event[]) => {
          this.populateEvents(level, events);
        }
      );
    }
  }

  populateEvents(level: Level, events: Event[]) {
    const currentLevel = this.levels.length-1;
    for(let i=0; i<events.length; i++) {
      const event = events[i];
      this.levels[currentLevel].events.push({
        id: event.id,
        name: event.name,
        skills: []
      });

      const currentEvent = this.levels[currentLevel].events.length-1;
      this.data.getEventSkills(level.id, event.id).subscribe(
        (skills: Skill[]) => {
          for(let x=0; x<skills.length; x++) {
            const skill = skills[x];
            this.levels[currentLevel].events[currentEvent].skills.push(skill);
          }
        }
      );
    }
  }

  skillChanged(skill: Skill, event: Event, level: Level, newName: string) {
    let reportCardSkill: ReportCardSkill = {
      id: skill.id,
      name: newName,
      events_id: event.id,
      levels_id: level.id
    };

    console.log(reportCardSkill);
    this.data.putSkill(reportCardSkill).subscribe(
      (data: ReportCardSkill) => { console.log(data); }
    );
  }

  deleteSkill(skillToRemove: Skill) {
    this.dialog.openConfirmDialog('Are you sure you wish to remove the skill "' + skillToRemove.name + '"?')
    .afterClosed().subscribe(res =>{
      if(res){
        this.data.deleteSkill(skillToRemove).subscribe(() => { 
          for(let i=0; i<this.levels.length; i++) {
            let level = this.levels[i];
            for(let x=0; x<level.events.length; x++) {
              let event = level.events[x];
              for(let y=0; y<event.skills.length; y++) {
                let skill = event.skills[y];
                if(skill.id === skillToRemove.id) {
                  this.levels[i].events[x].skills.splice(y);
                  this.dialog.openSnackBar('Skill Deleted!'); 
                  return;
                }
              }
            }
          }
          this.dialog.openSnackBar('Skill was not found...'); 
        });
      }
    });
  }

  addSkill(newSkill: MatInput, event: Event, level: Level) {
    let skill: ReportCardSkill = {
      events_id: event.id,
      levels_id: level.id,
      name: newSkill.value
    }
    console.log(skill);
    this.data.addSkill(skill).subscribe(
      (data: Skill) => {
        this.dialog.openSnackBar(data.name + ' has been added to ' + event.name + ' for ' + level.name);
        for(let i=0; i<this.levels.length; i++) {
          let level = this.levels[i];
          for(let x=0; x<level.events.length; x++) {
            this.levels[i].events[x].skills.push(data);
            newSkill.value = '';
            return;
          }
        }
      },
      (error: ErrorApi) => { console.log(error); }
    );
  }
}
