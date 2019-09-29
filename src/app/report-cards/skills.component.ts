import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { DataService } from "../data.service";
import { Skill } from "../interfaces/skill";
import { Event } from "../interfaces/event";
import { Level } from "../interfaces/level";
import { ReportCard } from "../interfaces/report-card";
import { ReportCardCompleted } from "../interfaces/report-card-completed";

@Component({
  selector: "app-skills",
  template: `
    <mat-list-item *ngFor="let skill of skillsInternal">
      <span>{{ skill.name }}</span>
      <span class="fill-remaining-space"></span>
      <mat-button-toggle-group
        #group="matButtonToggleGroup"
        [(ngModel)]="skill.rank"
        (click)="skillRankChanged(skill, group.value)"
        name="skillAbility"
        aria-label="Skill Ability"
      >
        <mat-button-toggle value="LEARNING" class="btnToggle"
          >Learning</mat-button-toggle
        >
        <mat-button-toggle value="MASTERED" class="btnToggle"
          >Mastered</mat-button-toggle
        >
      </mat-button-toggle-group>
    </mat-list-item>
  `,
  styles: []
})
export class SkillsComponent implements OnInit {
  @Input() event: Event;
  @Output() skills = new EventEmitter<Skill[]>();
  public skillsInternal: Skill[];

  constructor(private data: DataService) {}

  @Input() level: Level;
  @Input()
  set reportCard(reportCard: ReportCardCompleted) {
    this._reportCard = reportCard;
  }
  _reportCard: ReportCardCompleted;

  ngOnInit() {
    this.data
      .getEventSkills(this.level.id, this.event.id)
      .subscribe((skills: Skill[]) => {
        this.skillsInternal = skills;
        if (typeof this._reportCard.components !== "undefined") {
          for (let i = 0; i < this._reportCard.components.length; i++) {
            for (let x = 0; x < this.skillsInternal.length; x++) {
              if (
                this.skillsInternal[x].id ===
                this._reportCard.components[i].skill.id
              ) {
                this.skillsInternal[x].rank = this._reportCard.components[
                  i
                ].rank;
              }
            }
          }
        }
      });
  }

  skillRankChanged(skill: Skill, rank: string) {
    skill.rank = rank;

    for (let i = 0; i < this.skillsInternal.length; i++) {
      if (this.skillsInternal[i].id === skill.id) {
        this.skillsInternal[i] = skill;
        this.skills.emit(this.skillsInternal);
        return;
      }
    }
  }
}
