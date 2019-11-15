import { Athlete } from "./athlete";
import { Level } from "./level";
import { ReportCardComponent } from "./report-card-component";
import { Skill } from "./skill";
import { Event } from "./event";
import { ReportCardComments } from "./report-card-comments";

export interface ReportCardSentBack {
  report_cards_mod_id: number;
  report_cards_id: number;
  submitted_by: number;
  secondary_coach_id: number;
  athlete: Athlete;
  level: Level;
  comment: number;
  card_comments: ReportCardComments;
  status: string;
  comment_modifications: number;
  card_mod_comments: ReportCardComments;
  session: string;
  day_of_week: string;
  updated_date: string;
  events: Event[];
  components: ReportCardSentBackComponent[];
}

interface ReportCardSentBackComponent {
  report_cards_components_id: number;
  report_cards_mod_components_id: number;
  skill: Skill;
  rank: string;
  suggested_rank;
}
