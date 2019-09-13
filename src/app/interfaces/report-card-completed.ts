import { ReportCardComponent } from './report-card-component';
import { Athlete } from './athlete';
import { Level } from './level';
import { Skill } from './skill';
import { ReportCard } from './report-card';
import { Event } from './event';
import { ReportCardComments } from './report-card-comments';

export interface ReportCardCompleted extends ReportCard {
    components: ReportCardComponentCompleted[],
    athlete: Athlete,
    card_comments: ReportCardComments,
    level: Level,
    events: Event[]
}

export interface ReportCardComponentCompleted extends ReportCardComponent{
    skill: Skill
}
