export interface ReportCard {
  id?: number;
  submitted_by: number;
  secondary_coach_id: number;
  levels_id: number;
  athletes_id: number;
  comment: number;
  day_of_week: string;
  session: string;
  status: string;
  approved?: number;
  updated_date?: string;
  created_date?: string;
}
