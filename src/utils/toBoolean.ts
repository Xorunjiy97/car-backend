// utils/toBoolean.ts (вынеси в утилиту)
export const toBoolean = (value: unknown): boolean => {
    if (typeof value === 'boolean') return value
    if (typeof value === 'number') return value === 1
    if (typeof value === 'string') {
        const v = value.trim().toLowerCase()
        return v === 'true' || v === '1' || v === 'on' || v === 'yes'
    }
    return false
}
