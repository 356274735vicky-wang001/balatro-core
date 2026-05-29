// 3 关盲注（PRD §3.1）— 锁定
export const BLINDS = [
  { idx: 0, name: '小盲注', target: 300, icon: '🔵', tag: '小盲注' },
  { idx: 1, name: '中盲注', target: 500, icon: '🟡', tag: '大盲注' },
  { idx: 2, name: '大盲注', target: 800, icon: '🔴', tag: '头目盲注' },
]

export const TOTAL_BLINDS = BLINDS.length

// 通关奖励（PRD §3.2）：$5 + 剩余手数 × $1
export function blindReward(handsLeft) {
  return 5 + handsLeft * 1
}
