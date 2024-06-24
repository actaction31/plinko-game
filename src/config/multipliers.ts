

import { LinesType, MultiplierType } from '../@types'

// multiplierImages
import multiplier0dot3Img from '../assets/img/multipliers/multiplier0.3.png'
import multiplier0dot5Img from '../assets/img/multipliers/multiplier0.5.png'
import multiplier1dot5Img from '../assets/img/multipliers/multiplier1.5.png'
import multiplier1Img from '../assets/img/multipliers/multiplier1.png'
import multiplier10Img from '../assets/img/multipliers/multiplier10.png'
import multiplier110Img from '../assets/img/multipliers/multiplier110.png'
import multiplier15Img from '../assets/img/multipliers/multiplier15.png'
import multiplier18Img from '../assets/img/multipliers/multiplier18.png'
import multiplier2Img from '../assets/img/multipliers/multiplier2.png'
import multiplier25Img from '../assets/img/multipliers/multiplier25.png'
import multiplier3Img from '../assets/img/multipliers/multiplier3.png'
import multiplier33Img from '../assets/img/multipliers/multiplier33.png'
import multiplier41Img from '../assets/img/multipliers/multiplier41.png'
import multiplier5Img from '../assets/img/multipliers/multiplier5.png'
import multiplier88Img from '../assets/img/multipliers/multiplier88.png'

const multipliers = {
  1: {
    label: 'block-1',
    img: multiplier110Img
  },
  2: {
    label: 'block-2',
    img: multiplier88Img
  },
  3: {
    label: 'block-3',
    img: multiplier41Img
  },
  4: {
    label: 'block-4',
    img: multiplier33Img
  },
  5: {
    label: 'block-5',
    img: multiplier25Img
  },
  6: {
    label: 'block-6',
    img: multiplier18Img
  },
  7: {
    label: 'block-7',
    img: multiplier15Img
  },
  8: {
    label: 'block-8',
    img: multiplier10Img
  },
  9: {
    label: 'block-9',
    img: multiplier5Img
  },
  10: {
    label: 'block-10',
    img: multiplier3Img
  },
  11: {
    label: 'block-11',
    img: multiplier2Img
  },
  12: {
    label: 'block-12',
    img: multiplier1dot5Img
  },
  13: {
    label: 'block-13',
    img: multiplier1Img
  },
  14: {
    label: 'block-14',
    img: multiplier0dot5Img
  },
  15: {
    label: 'block-15',
    img: multiplier0dot3Img
  },
  16: {
    label: 'block-16',
    img: multiplier0dot3Img
  },
  17: {
    label: 'block-17',
    img: multiplier0dot3Img
  }
} as const

export type MultipliersType = keyof typeof multipliers

export function getMultiplier(value: MultipliersType): MultiplierType {
  return multipliers[value]
}

export const multiplyBlocks16Lines = [
  getMultiplier(1),
  getMultiplier(2),
  getMultiplier(3),
  getMultiplier(4),
  getMultiplier(5),
  getMultiplier(6),
  getMultiplier(7),
  getMultiplier(8),
  getMultiplier(9),
  getMultiplier(10),
  getMultiplier(11),
  getMultiplier(12),
  getMultiplier(13),
  getMultiplier(14),
  getMultiplier(15),
  getMultiplier(16),
  getMultiplier(17)
]

export const multiplyBlocksByLinesQnt = {
  16: multiplyBlocks16Lines
}

export function getMultiplierByLinesQnt(value: LinesType): MultiplierType[] {
  return multiplyBlocksByLinesQnt[value]
}