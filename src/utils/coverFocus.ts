import type { Area } from 'react-easy-crop'

export function focalPercentFromArea(area?: Area | null): number {
    const remain = 100 - (area?.height ?? 0)
    return (area && remain > 0) ? (area.y / remain) * 100 : 50
}

export function focalRatioFromArea(area?: Area | null): number {
    const percent = focalPercentFromArea(area)
    const ratio = Math.max(0, Math.min(1, percent / 100))
    return Number(ratio.toFixed(2))
}

export function objectPositionFromRatio(ratio: number): string {
    const pct = Math.max(0, Math.min(1, ratio)) * 100
    return `center ${pct.toFixed(1)}%`
}

export default {
    focalPercentFromArea,
    focalRatioFromArea,
    objectPositionFromRatio,
}
