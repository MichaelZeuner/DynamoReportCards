export interface PrintableReportCard {
    levels: string[],
    events: PrintableEvent[],
    coachComments: PrintableCoachComments[]
}

interface PrintableCoachComments {
    levelCompleted: string,
    comments: string,
    coach: string,
    date: string
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