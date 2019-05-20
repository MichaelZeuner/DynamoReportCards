export interface PrintableEvent {
    name: string,
    skills: PrintableSkill[] 
}

interface PrintableSkill {
    levels: PrintableLevel[]
}

interface PrintableLevel {
    rank: string,
    name: string
}