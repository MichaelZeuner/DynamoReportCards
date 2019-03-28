import { Event } from './event';

export interface Level {
    id: number;
    name: string,
    events: Event[]
}
