export interface Model {
    active: boolean
    countdownTime: number
    endTime?: number
    remainingTime?: number
}

export interface Config {
    shutdownCommand: string
    defaultCountdownTime: number
    overlayTime: number
    overlayPlusTimes: number[]
    editCountdownTimes: number[]
    editSliderMinCountdownTime:  number
    editSliderMaxCountdownTime:  number
    editSliderStepTime:  number
}