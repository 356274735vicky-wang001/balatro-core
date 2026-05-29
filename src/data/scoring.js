import { detectHandType } from './handTypes.js'
import { cardPoint } from './cards.js'

// 纯计算最终得分（无动画）—— 计分公式 PRD §1.2
//   基础筹码 = 牌型基础筹码 + 所有出牌点数之和
//   然后按 ownedJokers 顺序依次执行 effect 修改 (chips, mult)
//   最终得分 = chips × mult
export function computeScore(cards, ownedJokers = []) {
  const handType = detectHandType(cards)
  if (!handType) return { score: 0, handType: null, chips: 0, mult: 0 }
  let chips = handType.chips + cards.reduce((s, c) => s + cardPoint(c), 0)
  let mult = handType.mult
  for (const j of ownedJokers) {
    const res = j.apply({ chips, mult, cards, handType })
    if (res.triggered) { chips = res.chips; mult = res.mult }
  }
  return { score: chips * mult, handType, chips, mult }
}

function* combinations(arr, k) {
  const n = arr.length
  if (k > n) return
  const idx = Array.from({ length: k }, (_, i) => i)
  while (true) {
    yield idx.map((i) => arr[i])
    let i = k - 1
    while (i >= 0 && idx[i] === n - k + i) i--
    if (i < 0) return
    idx[i]++
    for (let j = i + 1; j < k; j++) idx[j] = idx[j - 1] + 1
  }
}

// AI 出牌：枚举手牌所有 1-5 张子集，取得分最高一组（PRD §5.5）
// 降级策略：手牌 ≤ 5 张时不枚举，直接全选打出
export function bestPlay(hand, ownedJokers = []) {
  if (hand.length <= 5) return hand.slice()
  let best = null
  let bestScore = -1
  const maxK = Math.min(5, hand.length)
  for (let k = 1; k <= maxK; k++) {
    for (const combo of combinations(hand, k)) {
      const { score } = computeScore(combo, ownedJokers)
      if (score > bestScore) { bestScore = score; best = combo }
    }
  }
  return best || hand.slice(0, 1)
}

// AI 商店建议：返回性价比最高（每 $1 增益最大）的 joker id
export function shopSuggestion(shopJokers, hand, ownedJokers = []) {
  const base = bestPlay(hand, ownedJokers)
  const baseScore = computeScore(base, ownedJokers).score
  let bestId = null
  let bestValue = -Infinity
  for (const j of shopJokers) {
    const withJoker = [...ownedJokers, j]
    const play = bestPlay(hand, withJoker)
    const gain = computeScore(play, withJoker).score - baseScore
    const value = gain / j.price
    if (value > bestValue) { bestValue = value; bestId = j.id }
  }
  return bestId
}
