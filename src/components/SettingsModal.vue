<script setup>
import { state, updateSetting, closeSettings } from '../store/game.js'

const speeds = [
  { key: 'slow', label: '慢' },
  { key: 'normal', label: '普通' },
  { key: 'fast', label: '快' },
]
</script>

<template>
  <div class="modal-overlay" @click.self="closeSettings">
    <div class="modal">
      <div class="modal-title">设置</div>

      <div class="settings-list">
        <div class="setting-row">
          <span class="s-label">BGM 音量</span>
          <input
            type="range" min="0" max="100" :value="state.settings.bgm"
            class="slider bgm"
            @input="updateSetting('bgm', Number($event.target.value))"
          />
        </div>
        <div class="setting-row">
          <span class="s-label">SFX 音量</span>
          <input
            type="range" min="0" max="100" :value="state.settings.sfx"
            class="slider sfx"
            @input="updateSetting('sfx', Number($event.target.value))"
          />
        </div>
        <div class="setting-row">
          <span class="s-label">动画速度</span>
          <div class="speed-group">
            <button
              v-for="s in speeds" :key="s.key"
              class="speed-btn"
              :class="{ on: state.settings.animSpeed === s.key }"
              @click="updateSetting('animSpeed', s.key)"
            >{{ s.label }}</button>
          </div>
        </div>
        <div class="setting-row">
          <span class="s-label">显示出牌公式预览</span>
          <button
            class="toggle"
            :class="{ on: state.settings.showFormula }"
            @click="updateSetting('showFormula', !state.settings.showFormula)"
          >
            <span class="knob"></span>
          </button>
        </div>
      </div>

      <button class="px-btn blue close-btn" @click="closeSettings">关闭</button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 150;
  background: rgba(0, 0, 0, 0.4);
  display: grid;
  place-items: center;
}
.modal {
  width: 420px;
  max-width: 92vw;
  background: linear-gradient(180deg, #1e3068 0%, #0a1438 100%);
  border: 2px solid var(--sb-blue);
  border-radius: 14px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6);
  padding: 22px 24px;
}
.modal-title { font-family: var(--sans); font-size: 24px; font-weight: 800; color: var(--gold); text-align: center; margin-bottom: 18px; }
.settings-list { display: flex; flex-direction: column; gap: 16px; }
.setting-row { display: flex; justify-content: space-between; align-items: center; }
.s-label { font-family: var(--sans); font-size: 14px; font-weight: 600; color: var(--text-dim); }
.slider { width: 150px; }
.slider.bgm { accent-color: #4dd6ff; }
.slider.sfx { accent-color: #ff8844; }

.speed-group { display: flex; gap: 6px; }
.speed-btn {
  padding: 6px 14px;
  border-radius: 6px;
  border: none;
  background: rgba(74, 107, 255, 0.15);
  color: var(--muted);
  font-family: var(--sans);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}
.speed-btn.on { background: var(--sb-blue); color: #fff; font-weight: 800; }

.toggle {
  width: 44px;
  height: 24px;
  border-radius: 12px;
  border: none;
  background: rgba(74, 107, 255, 0.25);
  position: relative;
  cursor: pointer;
  transition: background 0.18s ease;
}
.toggle.on { background: var(--sb-blue); }
.knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  transition: left 0.18s ease;
}
.toggle.on .knob { left: 22px; }

.close-btn { display: block; margin: 22px auto 0; min-width: 120px; }
</style>
