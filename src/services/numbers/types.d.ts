export type NumberRecord = {
    prevValue: number | null,
    currentValue: number,
    result: number | null
}

export type NumberOptions = 
    "negative" |
    "float"