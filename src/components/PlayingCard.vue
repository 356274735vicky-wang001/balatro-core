<script setup>
import { computed } from 'vue'

const props = defineProps({
  card: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  highlight: { type: Boolean, default: false },
  size: { type: String, default: 'hand' }, // hand | play
  interactive: { type: Boolean, default: true },
})
const emit = defineEmits(['select'])

const isRed = computed(() => props.card.suit === '♥' || props.card.suit === '♦')

function onClick() {
  if (props.interactive) emit('select', props.card)
}
</script>

<template>
  <div
    class="card"
    :class="[size, { selected, highlight, red: isRed, interactive }]"
    :data-id="card.id"
    @click="onClick"
  >
    <div class="corner tl">
      <span class="rank">{{ card.rank }}</span>
      <span class="suit">{{ card.suit }}</span>
    </div>
    <div class="center">{{ card.suit }}</div>
    <div class="corner br">
      <span class="rank">{{ card.rank }}</span>
      <span class="suit">{{ card.suit }}</span>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 100px;
  height: 145px;
  flex-shrink: 0;
  background: linear-gradient(165deg, var(--paper-1), var(--paper-2) 60%, var(--paper-3));
  border: 2px solid var(--card-edge);
  border-radius: 9px;
  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.5), 0 5px 10px rgba(0, 0, 0, 0.35);
  position: relative;
  color: #1a1a2e;
  user-select: none;
  transition: transform 0.16s ease, box-shadow 0.16s ease;
  will-change: transform;
}
.card.interactive { cursor: pointer; }
.card.interactive:hover { transform: translateY(-6px); }
.card.red { color: #d6293e; }

.corner {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1;
}
.corner.tl { top: 7px; left: 8px; }
.corner.br { bottom: 7px; right: 8px; transform: rotate(180deg); }
.corner .rank { font-family: var(--sans); font-weight: 800; font-size: 18px; }
.corner .suit { font-size: 15px; margin-top: 1px; }

.center {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 46px;
}

.card.selected {
  transform: translateY(-26px);
  box-shadow: 0 8px 0 rgba(74, 107, 255, 0.55), 0 0 20px rgba(77, 214, 255, 0.7);
  border-color: #4dd6ff;
}
.card.highlight {
  transform: translateY(-18px) scale(1.04);
  box-shadow: 0 8px 0 rgba(74, 107, 255, 0.5), 0 0 24px rgba(77, 214, 255, 0.9);
  border-color: #4dd6ff;
}
</style>
