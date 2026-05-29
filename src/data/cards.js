// 标准 52 张扑克：4 花色 × 13 点数，无大小王

export const SUITS = [
  { sym: '♠', name: 'spade', color: '#1a1a2e' },
  { sym: '♥', name: 'heart', color: '#d6293e' },
  { sym: '♦', name: 'diamond', color: '#d6293e' },
  { sym: '♣', name: 'club', color: '#1a1a2e' },
]

export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

// 点数值（计分用）：A=11，J/Q/K=10，其他=数字本身
export function cardPoint(card) {
  if (card.rank === 'A') return 11
  if (['J', 'Q', 'K'].includes(card.rank)) return 10
  return Number(card.rank)
}

// 排序权重：A 最小（1），用于按点排序与顺子判定
export function rankOrder(rank) {
  return RANKS.indexOf(rank) // A=0 ... K=12
}

let _uid = 0
export function buildDeck() {
  const deck = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ id: `c${_uid++}`, rank, suit: suit.sym, suitName: suit.name, color: suit.color })
    }
  }
  return deck
}

export function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
