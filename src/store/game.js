import { reactive, computed, nextTick } from 'vue'
import { buildDeck, shuffle, cardPoint, rankOrder } from '../data/cards.js'
import { detectHandType } from '../data/handTypes.js'
import { JOKER_LIB } from '../data/jokers.js'
import { BLINDS, TOTAL_BLINDS, blindReward } from '../data/blinds.js'
import { computeScore, bestPlay, shopSuggestion } from '../data/scoring.js'
import { flyText, dealFly, flipPlayed, animateNumber, sleep, setSpeed } from '../fx.js'

// ===== 常量 =====
const HAND_SIZE = 8
const HANDS_PER_BLIND = 4
const DISCARDS_PER_BLIND = 3
const JOKER_SLOTS = 5
const MAX_SELECT = 5

const SETTINGS_KEY = 'balatro.settings'
const SETTINGS_DEFAULT = { bgm: 50, sfx: 70, animSpeed: 'normal', showFormula: true }
const SPEED_MAP = { slow: 1.5, normal: 1, fast: 0.6 }

// ===== 状态 =====
export const state = reactive({
  gameState: 'playing', // playing | shop | won | lost
  currentBlindIndex: 0,
  deck: [],
  hand: [],
  selectedIds: [],
  playedCards: [],
  ownedJokers: [],
  money: 0,
  handsLeft: HANDS_PER_BLIND,
  discardsLeft: DISCARDS_PER_BLIND,
  blindScore: 0,

  // 计分动画实时值
  battleChips: 0,
  battleMult: 0,
  currentHandTypeName: '',
  highlightId: null,
  activeJokerIndex: -1,
  formula: { show: false, chips: 0, mult: 0, score: 0 },
  newCardIds: [],
  busy: false,

  // 商店
  shopJokers: [],
  shopSuggestionId: null,

  // AI / 设置
  aiThinking: false,
  settingsOpen: false,
  settings: { ...SETTINGS_DEFAULT },
})

// ===== 计算属性 =====
export const currentBlind = computed(() => BLINDS[state.currentBlindIndex])
export const selectedCards = computed(() => state.hand.filter((c) => state.selectedIds.includes(c.id)))
export const selectionHandType = computed(() =>
  state.selectedIds.length ? detectHandType(selectedCards.value) : null
)
export const previewScore = computed(() => {
  if (!state.selectedIds.length) return null
  return computeScore(selectedCards.value, state.ownedJokers)
})
export const canPlay = computed(
  () => !state.busy && state.gameState === 'playing' && state.selectedIds.length >= 1 && state.selectedIds.length <= MAX_SELECT
)
export const canDiscard = computed(
  () => !state.busy && state.gameState === 'playing' && state.selectedIds.length >= 1 && state.discardsLeft > 0
)
export const jokerSlotsFull = computed(() => state.ownedJokers.length >= JOKER_SLOTS)

export const consts = { HAND_SIZE, HANDS_PER_BLIND, DISCARDS_PER_BLIND, JOKER_SLOTS, MAX_SELECT, TOTAL_BLINDS }

// ===== 设置 =====
function applySpeed() {
  setSpeed(SPEED_MAP[state.settings.animSpeed] || 1)
}
export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) Object.assign(state.settings, SETTINGS_DEFAULT, JSON.parse(raw))
  } catch (e) {
    /* ignore */
  }
  applySpeed()
}
export function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings))
  applySpeed()
}
export function updateSetting(key, value) {
  state.settings[key] = value
  saveSettings()
}

// ===== 发牌 =====
async function dealTo(n) {
  const need = n - state.hand.length
  if (need <= 0) return
  const drawn = []
  for (let i = 0; i < need && state.deck.length > 0; i++) drawn.push(state.deck.shift())
  state.hand.push(...drawn)
  state.newCardIds = drawn.map((c) => c.id)
  await nextTick()
  await new Promise((r) => requestAnimationFrame(r))
  const deckEl = document.querySelector('.deck-pile')
  const els = drawn.map((c) => document.querySelector(`.hand-area [data-id="${c.id}"]`))
  dealFly(els, deckEl)
  state.newCardIds = []
}

// ===== 关卡 / 游戏生命周期 =====
async function startBlind(idx) {
  state.currentBlindIndex = idx
  state.deck = shuffle(buildDeck())
  state.hand = []
  state.playedCards = []
  state.selectedIds = []
  state.handsLeft = HANDS_PER_BLIND
  state.discardsLeft = DISCARDS_PER_BLIND
  state.blindScore = 0
  state.battleChips = 0
  state.battleMult = 0
  state.currentHandTypeName = ''
  state.highlightId = null
  state.activeJokerIndex = -1
  state.formula = { show: false, chips: 0, mult: 0, score: 0 }
  state.gameState = 'playing'
  state.busy = false
  await dealTo(HAND_SIZE)
}

export function startGame() {
  loadSettings()
  state.money = 0
  state.ownedJokers = []
  startBlind(0)
}

export function restart() {
  startGame()
}

// ===== 选牌 =====
export function toggleSelect(card) {
  if (state.busy) return
  const i = state.selectedIds.indexOf(card.id)
  if (i >= 0) {
    state.selectedIds.splice(i, 1)
  } else if (state.selectedIds.length < MAX_SELECT) {
    state.selectedIds.push(card.id)
  }
  // 已选 5 张时再点未选中的牌不响应（什么都不做）
}

export function sortByRank() {
  if (state.busy) return
  state.hand.sort((a, b) => rankOrder(a.rank) - rankOrder(b.rank) || a.suitName.localeCompare(b.suitName))
}
export function sortBySuit() {
  if (state.busy) return
  state.hand.sort((a, b) => a.suitName.localeCompare(b.suitName) || rankOrder(a.rank) - rankOrder(b.rank))
}

// ===== 核心：出牌计分时间线（PRD §5.1 / DESIGN §4） =====
export async function playSelected() {
  if (!canPlay.value) return
  state.busy = true

  const selected = selectedCards.value.slice() // 手牌顺序，左→右
  const ht = detectHandType(selected)

  // 1. FLIP：记录手牌旧位置 → 移到出牌区 → 飞过去
  const oldRects = {}
  for (const c of selected) {
    const el = document.querySelector(`.hand-area [data-id="${c.id}"]`)
    if (el) oldRects[c.id] = el.getBoundingClientRect()
  }
  const playedIds = new Set(selected.map((c) => c.id))
  state.playedCards = selected
  state.hand = state.hand.filter((c) => !playedIds.has(c.id))
  state.selectedIds = []
  state.currentHandTypeName = ht.name
  state.battleChips = 0
  state.battleMult = 0
  await nextTick()
  const playedEls = selected.map((c) => document.querySelector(`.play-row [data-id="${c.id}"]`))
  flipPlayed(playedEls, oldRects)
  await sleep(350)

  // 2. 锁定牌型基础 chips / mult（不含逐张点数）
  state.battleChips = ht.chips
  state.battleMult = ht.mult
  await sleep(200)

  // 3. 逐张高亮 + 蓝色 +N 飞向 chips 块
  const chipsBlock = document.querySelector('.chips-block')
  for (const c of selected) {
    state.highlightId = c.id
    const pts = cardPoint(c)
    const cardEl = document.querySelector(`.play-row [data-id="${c.id}"]`)
    flyText(cardEl, chipsBlock, `+${pts}`, '#4dd6ff')
    state.battleChips += pts
    await sleep(150)
  }
  state.highlightId = null

  // 4. 按 ownedJokers 顺序触发，金光 + 红色飞字
  const multBlock = document.querySelector('.mult-block')
  for (let i = 0; i < state.ownedJokers.length; i++) {
    const j = state.ownedJokers[i]
    const res = j.apply({ chips: state.battleChips, mult: state.battleMult, cards: selected, handType: ht })
    if (!res.triggered) continue
    state.activeJokerIndex = i
    const jEl = document.querySelector(`.joker-row [data-jindex="${i}"]`)
    const target = res.target === 'chips' ? chipsBlock : multBlock
    flyText(jEl, target, res.label, res.target === 'chips' ? '#4dd6ff' : '#ff5544')
    state.battleChips = res.chips
    state.battleMult = res.mult
    await sleep(300)
    state.activeJokerIndex = -1
    await sleep(60)
  }

  // 5. 公式爆出
  const score = state.battleChips * state.battleMult
  state.formula = { show: true, chips: state.battleChips, mult: state.battleMult, score }
  await sleep(1000)
  state.formula = { ...state.formula, show: false }

  // 6. blindScore RAF 累加 + 手数 -1
  await new Promise((resolve) => {
    animateNumber(() => state.blindScore, (v) => (state.blindScore = v), state.blindScore + score, 600, resolve)
  })
  state.handsLeft -= 1

  // 7. 清出牌区，补牌飞入
  await sleep(150)
  state.playedCards = []
  state.currentHandTypeName = ''
  state.battleChips = 0
  state.battleMult = 0
  await dealTo(HAND_SIZE)
  await sleep(200)

  // 8. 判定通关 / 失败
  state.busy = false
  checkBlindEnd()
}

function checkBlindEnd() {
  if (state.blindScore >= currentBlind.value.target) {
    const reward = blindReward(Math.max(0, state.handsLeft))
    state.money += reward
    if (state.currentBlindIndex >= TOTAL_BLINDS - 1) {
      state.gameState = 'won'
    } else {
      openShop()
    }
  } else if (state.handsLeft <= 0) {
    state.gameState = 'lost'
  }
}

// ===== 弃牌 =====
export async function discardSelected() {
  if (!canDiscard.value) return
  state.busy = true
  const ids = new Set(state.selectedIds)
  state.hand = state.hand.filter((c) => !ids.has(c.id))
  state.selectedIds = []
  state.discardsLeft -= 1
  await dealTo(HAND_SIZE)
  await sleep(250)
  state.busy = false
}

// ===== 商店 =====
function openShop() {
  state.gameState = 'shop'
  const picks = shuffle(JOKER_LIB).slice(0, 3)
  state.shopJokers = picks.map((j) => ({ joker: j, sold: false }))
  state.shopSuggestionId = null
  state.aiThinking = false
}

export function buyJoker(item) {
  if (item.sold) return
  if (jokerSlotsFull.value) return
  if (state.money < item.joker.price) return
  state.money -= item.joker.price
  state.ownedJokers.push(item.joker)
  item.sold = true
  if (state.shopSuggestionId === item.joker.id) state.shopSuggestionId = null
}

export function skipShop() {
  if (state.currentBlindIndex >= TOTAL_BLINDS - 1) {
    state.gameState = 'won'
  } else {
    startBlind(state.currentBlindIndex + 1)
  }
}

// ===== AI =====
export async function aiPlay() {
  if (state.busy || state.aiThinking) return
  state.aiThinking = true
  await sleep(800)
  const best = bestPlay(state.hand, state.ownedJokers)
  state.selectedIds = best.map((c) => c.id)
  state.aiThinking = false
  await sleep(200)
  await playSelected()
}

export async function aiSuggest() {
  if (state.aiThinking) return
  state.aiThinking = true
  await sleep(800)
  const sample = shuffle(buildDeck()).slice(0, HAND_SIZE)
  const avail = state.shopJokers.filter((s) => !s.sold).map((s) => s.joker)
  state.shopSuggestionId = avail.length ? shopSuggestion(avail, sample, state.ownedJokers) : null
  state.aiThinking = false
}

// ===== 设置 Modal =====
export function openSettings() { state.settingsOpen = true }
export function closeSettings() { state.settingsOpen = false }
