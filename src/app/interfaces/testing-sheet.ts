import { Level } from './level';
import { Athlete } from './athlete';

export interface TestingSheet {
    athlete: Athlete;
    levels: Level[];
}
