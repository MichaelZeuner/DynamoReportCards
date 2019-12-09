import { Event } from "./event";

export interface Level {
  id?: number;
  name?: string;
  level_groups_id?: number;
  level_number?: number;
  events?: Event[];
  advanced?: Boolean;
}
