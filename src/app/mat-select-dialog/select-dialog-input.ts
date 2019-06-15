export interface SelectDialogInput {
    label: string,
    options: SelectDialogOption[]
}

interface SelectDialogOption {
    id: number,
    value: string
}