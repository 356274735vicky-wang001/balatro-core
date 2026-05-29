// 小丑牌候选库（PRD §2.1）— 字段 + 数值锁定，严格 6 张
// 稀有度色板（PRD §2.2）：普通蓝 / 罕见绿 / 稀有红 / 传说紫
//
// 每张 joker 的 apply(ctx) 接收当前 { chips, mult, cards, handType }，
// 返回 { chips, mult, triggered, label, target }。
//   triggered: 本次出牌是否被触发（用于动画 + 计分）
//   label:     飞字文案（如 "+4 倍率" / "×4"）
//   target:    'chips' | 'mult' —— 飞向哪个块

export const RARITY = {
  common: { key: 'common', name: '普通', color: '#6cb4d3' },
  uncommon: { key: 'uncommon', name: '罕见', color: '#5bc97a' },
  rare: { key: 'rare', name: '稀有', color: '#e34b6f' },
  legend: { key: 'legend', name: '传说', color: '#b577ff' },
}

const FACE = ['J', 'Q', 'K']

export const JOKER_LIB = [
  {
    id: 'joker',
    name: '小丑',
    rarity: 'common',
    price: 3,
    art: '🃏',
    desc: '每手 +4 倍率（无条件加成）',
    apply({ chips, mult }) {
      return { chips, mult: mult + 4, triggered: true, label: '+4 倍率', target: 'mult' }
    },
  },
  {
    id: 'scholar',
    name: '学者',
    rarity: 'common',
    price: 3,
    art: '📖',
    desc: '打出的牌每张 A：+4 倍率',
    apply({ chips, mult, cards }) {
      const aces = cards.filter((c) => c.rank === 'A').length
      if (aces === 0) return { chips, mult, triggered: false }
      return { chips, mult: mult + 4 * aces, triggered: true, label: `+${4 * aces} 倍率`, target: 'mult' }
    },
  },
  {
    id: 'heart_collector',
    name: '红心收藏家',
    rarity: 'rare',
    price: 5,
    art: '❤️',
    desc: '打出的牌里含 ♥ 时，倍率 ×4',
    apply({ chips, mult, cards }) {
      const has = cards.some((c) => c.suit === '♥')
      if (!has) return { chips, mult, triggered: false }
      return { chips, mult: mult * 4, triggered: true, label: '×4 倍率', target: 'mult' }
    },
  },
  {
    id: 'club_lover',
    name: '梅花爱好者',
    rarity: 'rare',
    price: 5,
    art: '♣',
    desc: '打出的牌里含 ♣ 时，倍率 ×4',
    apply({ chips, mult, cards }) {
      const has = cards.some((c) => c.suit === '♣')
      if (!has) return { chips, mult, triggered: false }
      return { chips, mult: mult * 4, triggered: true, label: '×4 倍率', target: 'mult' }
    },
  },
  {
    id: 'royal',
    name: '皇家头牌',
    rarity: 'rare',
    price: 5,
    art: '👑',
    desc: '打出的牌里含 J / Q / K 时，倍率 ×10',
    apply({ chips, mult, cards }) {
      const has = cards.some((c) => FACE.includes(c.rank))
      if (!has) return { chips, mult, triggered: false }
      return { chips, mult: mult * 10, triggered: true, label: '×10 倍率', target: 'mult' }
    },
  },
  {
    id: 'sf_master',
    name: '同花顺大师',
    rarity: 'legend',
    price: 8,
    art: '🔥',
    desc: '打出同花顺时 +50 倍率',
    apply({ chips, mult, handType }) {
      if (!handType || handType.key !== 'straight_flush') return { chips, mult, triggered: false }
      return { chips, mult: mult + 50, triggered: true, label: '+50 倍率', target: 'mult' }
    },
  },
]

export function getJoker(id) {
  return JOKER_LIB.find((j) => j.id === id)
}
