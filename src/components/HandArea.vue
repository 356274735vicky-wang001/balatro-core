<script setup>
import {
  state, consts, canPlay, canDiscard,
  toggleSelect, playSelected, discardSelected, sortByRank, sortBySuit, aiPlay,
} from '../store/game.js'
import PlayingCard from './PlayingCard.vue'
</script>

<template>
  <section class="hand-section">
    <div class="hand-head">
      <span class="h-label">手牌</span>
      <span class="h-count">已选 {{ state.selectedIds.length }} / {{ consts.MAX_SELECT }} 张</span>
    </div>

    <div class="hand-area">
      <PlayingCard
        v-for="c in state.hand"
        :key="c.id"
        :card="c"
        :selected="state.selectedIds.includes(c.id)"
        @select="toggleSelect"
      />
    </div>

    <div class="actions">
      <button class="px-btn green" :disabled="!canPlay" @click="playSelected">
        出牌 ({{ state.selectedIds.length }})
      </button>
      <button class="px-btn red" :disabled="!canDiscard" @click="discardSelected">
        弃牌 ({{ state.discardsLeft }})
      </button>
      <button class="px-btn sort" :disabled="state.busy" @click="sortByRank">按点排序</button>
      <button class="px-btn sort" :disabled="state.busy" @click="sortBySuit">按花排序</button>
      <button
        class="px-btn purple ai-btn"
        :class="{ thinking: state.aiThinking }"
        :disabled="state.busy || state.aiThinking"
        @click="aiPlay"
      >
        {{ state.aiThinking ? '🤔 AI 思考中…' : '🤖 AI 出牌' }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.hand-section {
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  min-height: 0;
}
.hand-head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 4px;
}
.h-label { font-family: var(--sans); font-size: 14px; font-weight: 800; color: var(--gold); }
.h-count { font-family: var(--sans); font-size: 13px; font-weight: 700; color: var(--muted); }

.hand-area {
  flex: 1;
  display: flex;
  gap: 8px;
  align-items: flex-end;
  justify-content: center;
  padding-top: 38px;
  padding-bottom: 6px;
  min-height: 0;
}
.actions {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 8px 0 12px;
}
.ai-btn { margin-left: auto; }
</style>
