<script setup>
import { computed } from 'vue'
import { state, consts, currentBlind, selectionHandType, restart } from '../store/game.js'
import { blindReward } from '../data/blinds.js'

const handTypeLabel = computed(
  () => state.currentHandTypeName || selectionHandType.value?.name || '— 选牌出牌 —'
)
const isEmptyType = computed(() => !state.currentHandTypeName && !selectionHandType.value)
const progress = computed(() => {
  const t = currentBlind.value.target
  return Math.min(100, Math.round((state.blindScore / t) * 100))
})
const reward = computed(() => blindReward(Math.max(0, state.handsLeft)))
</script>

<template>
  <aside class="sidebar">
    <div class="logo">🃏 小丑牌</div>

    <!-- 盲注大面板 -->
    <div class="panel blind-panel">
      <div class="p-label">盲注 {{ state.currentBlindIndex + 1 }}/{{ consts.TOTAL_BLINDS }}</div>
      <div class="blind-head">
        <span class="blind-icon">{{ currentBlind.icon }}</span>
        <span class="blind-name">{{ currentBlind.name }}</span>
      </div>
      <div class="inset">
        <div class="inset-cap">目标至少</div>
        <div class="target-num">{{ currentBlind.target }}</div>
        <div class="reward">通关奖励 +${{ reward }}</div>
      </div>
    </div>

    <!-- Round Score -->
    <div class="panel">
      <div class="p-label">当前分</div>
      <div class="round-score">{{ state.blindScore }}</div>
      <div class="progress"><div class="progress-fill" :style="{ width: progress + '%' }"></div></div>
    </div>

    <!-- HAND 计分块 -->
    <div class="panel hand-score">
      <div class="ht-name" :class="{ empty: isEmptyType }">{{ handTypeLabel }}</div>
      <div class="score-row">
        <div class="chips-block">
          <span class="sc-val">{{ state.battleChips }}</span>
          <span class="sc-unit">筹码</span>
        </div>
        <span class="sc-x">×</span>
        <div class="mult-block">
          <span class="sc-val">{{ state.battleMult }}</span>
          <span class="sc-unit">倍率</span>
        </div>
      </div>
    </div>

    <!-- Hands / Discards -->
    <div class="hd-row">
      <div class="hd-block">
        <div class="hd-label">剩余手数</div>
        <div class="hd-val green">{{ state.handsLeft }}</div>
      </div>
      <div class="hd-block">
        <div class="hd-label">剩余弃牌</div>
        <div class="hd-val red">{{ state.discardsLeft }}</div>
      </div>
    </div>

    <!-- 金币 -->
    <div class="money">
      <span class="money-sign">$</span>
      <span class="money-val">{{ state.money }}</span>
    </div>

    <!-- Ante / Round -->
    <div class="ante">
      <span class="orange">底注 {{ state.currentBlindIndex + 1 }}/{{ consts.TOTAL_BLINDS }}</span>
      <span class="dot">·</span>
      <span class="blue">回合 {{ state.currentBlindIndex + 1 }}</span>
    </div>

    <button class="px-btn red restart" @click="restart">重新开始</button>
  </aside>
</template>

<style scoped>
.sidebar {
  width: min(28vw, 480px);
  min-width: 280px;
  height: 100vh;
  background: linear-gradient(180deg, #1a2a5a, #111e44);
  border-right: 2px solid rgba(74, 107, 255, 0.4);
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  overflow: hidden;
  flex-shrink: 0;
}
.logo {
  font-family: var(--pixel);
  font-size: 18px;
  color: var(--gold);
  text-shadow: 2px 2px 0 #000;
  text-align: center;
  margin-bottom: 2px;
}
.panel {
  background: linear-gradient(180deg, #1e3068, #152050);
  border: 2px solid rgba(74, 107, 255, 0.5);
  border-radius: 10px;
  padding: 8px 12px;
}
.p-label {
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  margin-bottom: 4px;
}
.blind-head { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.blind-icon { font-size: 22px; }
.blind-name { font-family: var(--sans); font-size: 18px; font-weight: 800; color: #fff; }
.inset {
  background: var(--inset);
  border: 1px solid rgba(74, 107, 255, 0.3);
  border-radius: 8px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.inset-cap { font-size: 12px; color: var(--muted); }
.target-num { font-family: var(--display); font-size: 28px; color: var(--gold); line-height: 1.1; }
.reward { font-family: var(--sans); font-size: 13px; font-weight: 700; color: var(--gold); }

.round-score { font-family: var(--display); font-size: 42px; color: #4dd6ff; line-height: 1; }
.progress {
  margin-top: 6px;
  height: 8px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(74, 107, 255, 0.3);
  overflow: hidden;
}
.progress-fill { height: 100%; background: linear-gradient(90deg, #4dd6ff, #2196f3); transition: width 0.3s ease; }

.hand-score { display: flex; flex-direction: column; }
.ht-name {
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 700;
  color: #4dd6ff;
  text-align: center;
  margin-bottom: 6px;
}
.ht-name.empty { color: var(--muted); }
.score-row { display: flex; align-items: stretch; gap: 6px; }
.chips-block,
.mult-block {
  flex: 1;
  border-radius: 10px;
  padding: 8px 4px 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.chips-block {
  background: linear-gradient(135deg, #4dd6ff, #2196f3);
  border: 2px solid #1a7bd4;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 4px 0 #0d4a80;
}
.mult-block {
  background: linear-gradient(135deg, #ff8844, #ff3344);
  border: 2px solid #cc2233;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 4px 0 #8b1a1a;
}
.sc-val { font-family: var(--pixel); font-size: 28px; color: rgba(0, 5, 20, 0.9); line-height: 1; }
.sc-unit { font-family: var(--sans); font-size: 11px; color: rgba(0, 0, 0, 0.55); margin-top: 3px; }
.sc-x { font-family: var(--pixel); font-size: 14px; color: var(--text-dim); align-self: center; }

.hd-row { display: flex; gap: 8px; }
.hd-block {
  flex: 1;
  background: #1e3068;
  border: 2px solid rgba(74, 107, 255, 0.5);
  border-radius: 8px;
  padding: 5px 6px;
  text-align: center;
}
.hd-label { font-family: var(--sans); font-size: 12px; color: var(--muted); }
.hd-val { font-family: var(--display); font-size: 34px; line-height: 1; }
.hd-val.green { color: #62d18b; }
.hd-val.red { color: #ff5544; }

.money {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: var(--inset);
  border: 2px solid rgba(74, 107, 255, 0.5);
  border-radius: 10px;
  padding: 4px 10px;
}
.money-sign { font-family: var(--pixel); font-size: 14px; color: var(--gold); }
.money-val { font-family: var(--display); font-size: 44px; color: var(--money); line-height: 1; }

.ante { text-align: center; font-family: var(--sans); font-size: 13px; }
.ante .orange { color: var(--gold); }
.ante .blue { color: #4dd6ff; }
.ante .dot { color: var(--muted); margin: 0 5px; }

.restart { margin-top: auto; }
</style>
