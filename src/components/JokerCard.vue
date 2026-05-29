<script setup>
import { computed } from 'vue'
import { RARITY } from '../data/jokers.js'

const props = defineProps({
  joker: { type: Object, required: true },
  active: { type: Boolean, default: false }, // 计分触发金光
  suggested: { type: Boolean, default: false }, // 商店 AI 建议高亮
  sold: { type: Boolean, default: false },
})

const rarity = computed(() => RARITY[props.joker.rarity])
</script>

<template>
  <div
    class="joker-card"
    :class="{ active, suggested, sold }"
    :style="{ '--rar': rarity.color }"
  >
    <div class="jk-top">
      <span class="jk-name">{{ joker.name }}</span>
    </div>
    <div class="jk-art">{{ joker.art }}</div>
    <div class="jk-desc">{{ joker.desc }}</div>
    <div class="jk-rarity" :style="{ color: rarity.color }">{{ rarity.name }}</div>
    <div v-if="suggested" class="jk-badge">推荐</div>
  </div>
</template>

<style scoped>
.joker-card {
  width: 140px;
  height: 200px;
  flex-shrink: 0;
  background: linear-gradient(170deg, var(--paper-1), var(--paper-2) 55%, var(--paper-3));
  border: 2px solid var(--card-edge);
  border-radius: 10px;
  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.5), 0 5px 12px rgba(0, 0, 0, 0.4);
  position: relative;
  padding: 10px 9px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #1a1a2e;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  will-change: transform;
}
/* 稀有度四角内描边 */
.joker-card::after {
  content: '';
  position: absolute;
  inset: 5px;
  border: 2px solid var(--rar);
  border-radius: 7px;
  opacity: 0.85;
  pointer-events: none;
}
.jk-top { width: 100%; text-align: center; }
.jk-name { font-family: var(--sans); font-weight: 800; font-size: 13px; }
.jk-art {
  flex: 1;
  display: grid;
  place-items: center;
  font-size: 48px;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.25));
}
.jk-desc {
  font-size: 10px;
  line-height: 1.3;
  text-align: center;
  color: #3a3a4a;
  min-height: 38px;
}
.jk-rarity {
  font-family: var(--sans);
  font-weight: 800;
  font-size: 10px;
  letter-spacing: 1px;
  margin-top: 4px;
}
.joker-card.active {
  transform: translateY(-18px) scale(1.15);
  box-shadow: 0 0 16px 4px rgba(255, 200, 87, 0.9), 0 8px 0 rgba(0, 0, 0, 0.4);
  z-index: 5;
}
.joker-card.suggested {
  box-shadow: 0 0 0 3px var(--gold), 0 0 18px rgba(255, 200, 87, 0.8), 0 5px 12px rgba(0, 0, 0, 0.4);
}
.joker-card.sold { opacity: 0.5; }
.jk-badge {
  position: absolute;
  top: -10px;
  right: -8px;
  background: var(--gold);
  color: #050818;
  font-family: var(--sans);
  font-weight: 800;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}
</style>
