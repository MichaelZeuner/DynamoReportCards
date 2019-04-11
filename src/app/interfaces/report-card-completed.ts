import { ReportCardComponent } from './report-card-component';
import { Athlete } from './athlete';
import { Level } from './level';
import { Skill } from './skill';
import { ReportCard } from './report-card';
import { Event } from './event';

export interface ReportCardCompleted extends ReportCard {
    components: ReportCardComponentCompleted[],
    athlete: Athlete,
    level: Level,
    events: Event[]
}

export interface ReportCardComponentCompleted extends ReportCardComponent{
    skill: Skill
}
