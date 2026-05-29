<script setup>
import { computed } from 'vue'
import { state, restart } from '../store/game.js'

const won = computed(() => state.gameState === 'won')
</script>

<template>
  <div class="end-overlay">
    <div class="end-panel" :class="won ? 'win' : 'lose'">
      <h1 class="end-title">{{ won ? '🎉 通关全部' : '💀 失败' }}</h1>
      <div class="end-money">
        <span class="em-label">最终金币</span>
        <span class="em-val">${{ state.money }}</span>
      </div>
      <div class="jokers-held">
        <div class="jh-label">持有的 Joker</div>
        <div class="jh-list">
          <span v-for="(j, i) in state.ownedJokers" :key="i" class="jh-chip">{{ j.art }} {{ j.name }}</span>
          <span v-if="!state.ownedJokers.length" class="jh-none">（无）</span>
        </div>
      </div>
      <button class="px-btn red" @click="restart">重新开始</button>
    </div>
  </div>
</template>

<style scoped>
.end-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  background: rgba(5, 8, 24, 0.78);
  backdrop-filter: blur(4px);
}
.end-panel {
  width: 460px;
  max-width: 90vw;
  background: linear-gradient(180deg, #1e3068 0%, #0a1438 100%);
  border: 2px solid var(--sb-blue);
  border-radius: 18px;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.6);
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.end-title { font-family: var(--sans); font-size: 32px; font-weight: 900; margin: 0; }
.win .end-title { color: var(--gold); text-shadow: 0 0 18px rgba(255, 200, 87, 0.6); }
.lose .end-title { color: #ff5544; text-shadow: 0 0 18px rgba(255, 85, 68, 0.5); }
.end-money { display: flex; flex-direction: column; align-items: center; }
.em-label { font-family: var(--sans); font-size: 13px; color: var(--muted); }
.em-val { font-family: var(--display); font-size: 48px; color: var(--money); line-height: 1; }
.jokers-held { width: 100%; text-align: center; }
.jh-label { font-family: var(--sans); font-size: 13px; color: var(--muted); margin-bottom: 8px; }
.jh-list { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.jh-chip {
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 700;
  background: rgba(74, 107, 255, 0.18);
  border: 1px solid rgba(74, 107, 255, 0.4);
  border-radius: 8px;
  padding: 4px 10px;
}
.jh-none { color: var(--muted); }
</style>
