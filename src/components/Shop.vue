<script setup>
import { computed } from 'vue'
import { state, consts, jokerSlotsFull, buyJoker, skipShop, aiSuggest } from '../store/game.js'
import JokerCard from './JokerCard.vue'

function btnState(item) {
  if (item.sold) return { label: '已售出', disabled: true }
  if (jokerSlotsFull.value) return { label: '槽满了', disabled: true }
  if (state.money < item.joker.price) return { label: '钱不够', disabled: true }
  return { label: `购买 $${item.joker.price}`, disabled: false }
}

const subtitle = computed(
  () => `通关奖励到账！金币 $${state.money} · Joker 槽 ${state.ownedJokers.length}/${consts.JOKER_SLOTS}`
)
</script>

<template>
  <div class="shop">
    <h1 class="shop-title">商店</h1>
    <p class="shop-sub">{{ subtitle }}</p>

    <div class="shop-row">
      <div v-for="(item, i) in state.shopJokers" :key="i" class="shop-item">
        <JokerCard
          :joker="item.joker"
          :sold="item.sold"
          :suggested="state.shopSuggestionId === item.joker.id && !item.sold"
        />
        <button class="px-btn green buy-btn" :disabled="btnState(item).disabled" @click="buyJoker(item)">
          {{ btnState(item).label }}
        </button>
      </div>
    </div>

    <div class="shop-actions">
      <button
        class="px-btn purple"
        :class="{ thinking: state.aiThinking }"
        :disabled="state.aiThinking"
        @click="aiSuggest"
      >
        {{ state.aiThinking ? '🤔 AI 思考中…' : '🤖 AI 建议' }}
      </button>
      <button class="px-btn blue skip-btn" @click="skipShop">跳过 →</button>
    </div>
  </div>
</template>

<style scoped>
.shop {
  grid-row: 2 / 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 20px;
  position: relative;
}
.shop-title { font-family: var(--sans); font-size: 32px; font-weight: 900; color: var(--gold); margin: 0; }
.shop-sub { font-family: var(--sans); font-size: 15px; color: var(--text-dim); margin: 0; }
.shop-row { display: flex; gap: 28px; align-items: flex-start; margin: 10px 0; }
.shop-item { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.buy-btn { width: 140px; min-height: 44px; font-size: 14px; padding: 10px; }
.shop-actions {
  display: flex;
  gap: 14px;
  align-items: center;
  position: absolute;
  bottom: 20px;
  right: 28px;
}
.skip-btn { min-width: 160px; }
</style>
