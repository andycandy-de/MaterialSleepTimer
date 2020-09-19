
const minMillies: number = 1000 * 60;

const hourMillies: number = minMillies * 60;

export function milliesToMin(millies: number): number {
    return millies / minMillies;
}

export function minToMillies(min: number): number {
    return min * minMillies;
}

export function milliesToHour(millies: number): number {
    return millies / hourMillies;
}

export function hourToMillies(hour: number): number {
    return hour * hourMillies;
}