<script setup>
import { computed } from 'vue'
import { state, previewScore, selectionHandType } from '../store/game.js'
import PlayingCard from './PlayingCard.vue'

const showPreview = computed(
  () => state.settings.showFormula && state.selectedIds.length > 0 && previewScore.value
)
const floatType = computed(() => state.currentHandTypeName || selectionHandType.value?.name || '')
</script>

<template>
  <section class="play-area">
    <div class="pa-head">
      <span class="pa-title">出牌区</span>
      <span v-if="floatType" class="pa-type">{{ floatType }}</span>
    </div>

    <!-- 出牌中：展示飞过来的牌 -->
    <div v-if="state.playedCards.length" class="play-row">
      <PlayingCard
        v-for="c in state.playedCards"
        :key="c.id"
        :card="c"
        :interactive="false"
        :highlight="state.highlightId === c.id"
        size="play"
      />
    </div>

    <!-- 空态：预览公式 或 提示文字 -->
    <div v-else class="pa-empty">
      <div v-if="showPreview" class="preview-formula">
        <span class="pf-chips">{{ previewScore.chips }}</span>
        <span class="pf-op">×</span>
        <span class="pf-mult">{{ previewScore.mult }}</span>
        <span class="pf-op">=</span>
        <span class="pf-score">{{ previewScore.score }}</span>
      </div>
      <div v-else class="pa-hint">选择手牌组成牌型（1-5 张）</div>
    </div>

    <!-- 计分公式爆出 -->
    <Transition name="formula">
      <div v-if="state.formula.show" class="final-formula">
        <span class="ff-chips">{{ state.formula.chips }}</span>
        <span class="ff-op">×</span>
        <span class="ff-mult">{{ state.formula.mult }}</span>
        <span class="ff-op">=</span>
        <span class="ff-score">{{ state.formula.score }}</span>
      </div>
    </Transition>

    <!-- 牌堆（v7：absolute 内嵌出牌区右下角） -->
    <div class="deck-wrap">
      <div class="deck-pile">
        <div class="deck-layer l3"></div>
        <div class="deck-layer l2"></div>
        <div class="deck-layer l1"></div>
      </div>
      <div class="deck-count">{{ state.deck.length }}/52</div>
    </div>
  </section>
</template>

<style scoped>
.play-area {
  position: relative;
  background: rgba(5, 8, 24, 0.5);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 16px 0;
  min-height: 0;
  overflow: hidden;
}
.pa-head {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 24px;
}
.pa-title { font-family: var(--sans); font-size: 13px; font-weight: 700; color: var(--muted); }
.pa-type { font-family: var(--sans); font-size: 16px; font-weight: 800; color: #4dd6ff; }

.play-row {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 12px;
  padding-top: 14px;
  width: 100%;
}
.pa-empty {
  flex: 1;
  display: grid;
  place-items: center;
  width: 100%;
}
.pa-hint { font-family: var(--sans); font-size: 14px; color: var(--muted); opacity: 0.55; }
.preview-formula {
  display: flex;
  align-items: baseline;
  gap: 10px;
  font-family: var(--pixel);
}
.pf-chips { color: #4dd6ff; font-size: 22px; }
.pf-mult { color: #ff8844; font-size: 22px; }
.pf-op { color: var(--text-dim); font-size: 14px; }
.pf-score { color: var(--gold); font-size: 28px; }

.final-formula {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  z-index: 8;
  background: radial-gradient(ellipse at center, rgba(10, 20, 60, 0.85), rgba(5, 8, 24, 0.4) 70%);
  font-family: var(--pixel);
  pointer-events: none;
}
.ff-chips { color: #4dd6ff; font-size: 52px; text-shadow: 0 0 18px rgba(77, 214, 255, 0.8); }
.ff-mult { color: #ff8844; font-size: 52px; text-shadow: 0 0 18px rgba(255, 136, 68, 0.8); }
.ff-op { color: var(--text-dim); font-size: 30px; }
.ff-score { color: var(--gold); font-size: 72px; text-shadow: 0 0 24px rgba(255, 200, 87, 0.9); }

.formula-enter-active { transition: all 0.18s cubic-bezier(0.2, 1.4, 0.5, 1); }
.formula-leave-active { transition: all 0.25s ease; }
.formula-enter-from { opacity: 0; transform: scale(0.6); }
.formula-leave-to { opacity: 0; transform: scale(1.2); }

/* 牌堆 */
.deck-wrap {
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 2;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.deck-pile { position: relative; width: 90px; height: 130px; }
.deck-layer {
  position: absolute;
  inset: 0;
  border-radius: 8px;
  border: 2px solid #1a0f24;
  background: repeating-linear-gradient(45deg, #6b3ec9 0 8px, #2d0d6e 8px 16px);
}
.deck-layer.l3 { transform: translate(-6px, 6px); opacity: 0.55; }
.deck-layer.l2 { transform: translate(-3px, 3px); opacity: 0.8; }
.deck-count { font-family: var(--display); font-size: 14px; color: var(--gold); }
</style>
