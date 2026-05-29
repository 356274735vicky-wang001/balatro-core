<script setup>
import { onMounted, computed } from 'vue'
import { state, startGame, openSettings } from './store/game.js'
import SideBar from './components/SideBar.vue'
import JokerRow from './components/JokerRow.vue'
import PlayArea from './components/PlayArea.vue'
import HandArea from './components/HandArea.vue'
import Shop from './components/Shop.vue'
import EndScreen from './components/EndScreen.vue'
import SettingsModal from './components/SettingsModal.vue'

const isShop = computed(() => state.gameState === 'shop')
const isEnd = computed(() => state.gameState === 'won' || state.gameState === 'lost')

onMounted(() => startGame())
</script>

<template>
  <div class="game-root">
    <SideBar />

    <main class="main-area" :class="{ shop: isShop }">
      <JokerRow />
      <template v-if="isShop">
        <Shop />
      </template>
      <template v-else>
        <PlayArea />
        <HandArea />
      </template>
    </main>

    <button class="settings-btn" @click="openSettings" aria-label="设置">⚙️</button>

    <SettingsModal v-if="state.settingsOpen" />
    <EndScreen v-if="isEnd" />
  </div>
</template>

<style scoped>
.game-root {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
.main-area {
  flex: 1;
  min-width: 0;
  height: 100vh;
  display: grid;
  grid-template-rows: 230px 1fr 280px;
  gap: 10px;
  padding: 14px 14px 14px 16px;
  overflow: hidden;
}
.main-area.shop {
  grid-template-rows: 230px 1fr;
}
.settings-btn {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 100;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(180deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
  box-shadow: 0 4px 0 #92400e, 0 6px 12px rgba(245, 158, 11, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border: 2px solid rgba(0, 0, 0, 0.35);
  color: #fff;
  font-size: 22px;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: all 0.15s ease;
}
.settings-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
.settings-btn:active { transform: translateY(2px); }
</style>
