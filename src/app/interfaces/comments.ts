import { Level } from "./level";

export interface Comments {
  id?: number;
  type: string;
  comment: string;
  levels: Level[];
}
