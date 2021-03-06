import { ReportCardComments } from "./report-card-comments";

export interface PrintableReportCard {
  max_level: number;
  levels: PrintableLevel[];
  events: PrintableEvent[];
  coachComments: PrintableCoachComments[];
  athlete: string;
}

interface PrintableLevel {
  name: string;
  level_number: number;
  id: number;
}

interface PrintableCoachComments {
  levelCompleted: string;
  comments: number;
  level_name: string;
  level_number: number;
  first_name: string;
  s_level_number: number;
  s_first_name: string;
  last_name: string;
  updated_date: string;
  session: string;
}

interface PrintableEvent {
  id: number;
  name: string;
  skills: PrintableSkill[];
}

interface PrintableSkill {
  levels: PrintableLevel[];
}

interface PrintableLevel {
  id: number;
  rank: string;
  name: string;
}
