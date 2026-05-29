<script setup>
import { state, consts } from '../store/game.js'
import JokerCard from './JokerCard.vue'

const emptySlots = (n) => Math.max(0, consts.JOKER_SLOTS - n)
</script>

<template>
  <section class="joker-section">
    <div class="joker-title">JOKERS · {{ state.ownedJokers.length }}/{{ consts.JOKER_SLOTS }}</div>
    <div class="joker-row">
      <JokerCard
        v-for="(j, i) in state.ownedJokers"
        :key="i"
        :data-jindex="i"
        :joker="j"
        :active="state.activeJokerIndex === i"
      />
      <div v-for="n in emptySlots(state.ownedJokers.length)" :key="'empty-' + n" class="joker-empty">
        <span class="plus">+</span>
        <span class="label">空槽</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.joker-section {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  padding: 8px 14px 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.joker-title {
  font-family: var(--pixel);
  font-size: 14px;
  color: var(--gold);
  text-shadow: 2px 2px 0 #000;
  letter-spacing: 1px;
  margin-bottom: 8px;
}
.joker-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.joker-empty {
  width: 140px;
  height: 200px;
  border: 2px dashed rgba(79, 70, 229, 0.4);
  border-radius: 10px;
  background: rgba(79, 70, 229, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-shrink: 0;
}
.joker-empty .plus { font-family: var(--sans); font-size: 24px; color: var(--muted); }
.joker-empty .label { font-family: var(--sans); font-size: 12px; color: var(--muted); }
</style>
