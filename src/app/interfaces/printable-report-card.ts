export interface PrintableReportCard {
    levels: PrintableLevel[],
    events: PrintableEvent[],
    coachComments: PrintableCoachComments[],
    athlete: string
}

interface PrintableLevel {
    name: string;
    id: number;
}

interface PrintableCoachComments {
    levelCompleted: string,
    comments: string,
    level_name: string,
    first_name: string,
    last_name: string,
    updated_date: string
}

interface PrintableEvent {
    id: number,
    name: string,
    skills: PrintableSkill[] 
}

interface PrintableSkill {
    levels: PrintableLevel[]
}

interface PrintableLevel {
    id: number,
    rank: string,
    name: string
}