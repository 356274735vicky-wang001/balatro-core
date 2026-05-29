import { RANKS } from './cards.js'

// 牌型基础值（PRD §1.1，按基础筹码降序）— 数值锁定
export const HAND_TYPES = {
  straight_flush: { key: 'straight_flush', name: '同花顺', chips: 100, mult: 8 },
  four_kind: { key: 'four_kind', name: '四条', chips: 60, mult: 7 },
  full_house: { key: 'full_house', name: '葫芦', chips: 40, mult: 4 },
  flush: { key: 'flush', name: '同花', chips: 35, mult: 4 },
  straight: { key: 'straight', name: '顺子', chips: 30, mult: 4 },
  three_kind: { key: 'three_kind', name: '三条', chips: 30, mult: 3 },
  two_pair: { key: 'two_pair', name: '两对', chips: 20, mult: 2 },
  pair: { key: 'pair', name: '对子', chips: 10, mult: 2 },
  high_card: { key: 'high_card', name: '高牌', chips: 5, mult: 1 },
}

function isStraight(cards) {
  if (cards.length !== 5) return false
  const idx = cards.map((c) => RANKS.indexOf(c.rank)).sort((a, b) => a - b)
  // 普通连续
  let consecutive = true
  for (let i = 1; i < idx.length; i++) {
    if (idx[i] !== idx[i - 1] + 1) { consecutive = false; break }
  }
  if (consecutive) return true
  // A-2-3-4-5（A 当 1）：索引为 [0(A),1,2,3,4]
  const lowAce = JSON.stringify(idx) === JSON.stringify([0, 1, 2, 3, 4])
  // 10-J-Q-K-A：索引为 [0(A),9,10,11,12]
  const highAce = JSON.stringify(idx) === JSON.stringify([0, 9, 10, 11, 12])
  return lowAce || highAce
}

function isFlush(cards) {
  return cards.length === 5 && cards.every((c) => c.suit === cards[0].suit)
}

// 识别牌型，支持 1-5 张（不足 5 张时只匹配不依赖 5 张的牌型）
export function detectHandType(cards) {
  if (!cards || cards.length === 0) return null

  const counts = {}
  for (const c of cards) counts[c.rank] = (counts[c.rank] || 0) + 1
  const countVals = Object.values(counts).sort((a, b) => b - a) // 降序

  const flush = isFlush(cards)
  const straight = isStraight(cards)

  if (flush && straight) return HAND_TYPES.straight_flush
  if (countVals[0] === 4) return HAND_TYPES.four_kind
  if (countVals[0] === 3 && countVals[1] === 2) return HAND_TYPES.full_house
  if (flush) return HAND_TYPES.flush
  if (straight) return HAND_TYPES.straight
  if (countVals[0] === 3) return HAND_TYPES.three_kind
  if (countVals[0] === 2 && countVals[1] === 2) return HAND_TYPES.two_pair
  if (countVals[0] === 2) return HAND_TYPES.pair
  return HAND_TYPES.high_card
}
