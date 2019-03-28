import { Skill } from './skill';

export interface Event {
    id: number,
    name: string,
    skills: Skill[]
}
