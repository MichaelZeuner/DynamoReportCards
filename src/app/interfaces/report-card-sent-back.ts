import { Athlete } from './athlete';
import { Level } from './level';
import { ReportCardComponent } from './report-card-component';
import { Skill } from './skill';
import { Event } from './event';

export interface ReportCardSentBack {
    report_cards_mod_id: number,
    report_cards_id: number,
    submitted_by: number,
    athlete: Athlete,
    level: Level,
    comment: string,
    status: string,
    comment_modifications: string,
    updated_date: string,
    events: Event[],
    components: ReportCardSentBackComponent[]
}

interface ReportCardSentBackComponent {
    report_cards_components_id: number,
    report_cards_mod_components_id: number,
    skill: Skill,
    rank: string,
    suggested_rank
}
