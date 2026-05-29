import gsap from 'gsap'

// 动画速度全局倍率（受设置「动画速度」控制：慢 1.5× / 普通 1× / 快 0.6×）
let _speed = 1
export function setSpeed(mult) { _speed = mult }
export function spd(ms) { return ms * _speed }

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, spd(ms)))
}

function centerOf(el) {
  const r = el.getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
}

// 飞字：从 fromEl 中心飞向 toEl 中心，途中放大、到达后淡出
export function flyText(fromEl, toEl, text, color) {
  if (!fromEl || !toEl) return
  const from = centerOf(fromEl)
  const to = centerOf(toEl)
  const el = document.createElement('div')
  el.className = 'fly-text'
  el.textContent = text
  el.style.color = color
  el.style.left = from.x + 'px'
  el.style.top = from.y + 'px'
  document.body.appendChild(el)
  gsap.fromTo(
    el,
    { x: 0, y: 0, scale: 0.6, opacity: 0 },
    {
      x: to.x - from.x,
      y: to.y - from.y,
      scale: 1.4,
      opacity: 1,
      duration: spd(400) / 1000,
      ease: 'power2.out',
      onComplete() {
        gsap.to(el, { opacity: 0, scale: 1.6, duration: 0.18, onComplete: () => el.remove() })
      },
    }
  )
}

// 发牌：把目标卡元素从牌堆位置「飞入」到它们的最终槽位
// cardEls: 本次新出现的卡 DOM 列表；deckEl: 牌堆元素
export function dealFly(cardEls, deckEl) {
  if (!deckEl) return
  const dr = centerOf(deckEl)
  cardEls.forEach((el, i) => {
    if (!el) return
    const cr = centerOf(el)
    gsap.fromTo(
      el,
      { x: dr.x - cr.x, y: dr.y - cr.y, rotation: -10, opacity: 0 },
      {
        x: 0, y: 0, rotation: 0, opacity: 1,
        duration: spd(400) / 1000,
        delay: spd(60 * i) / 1000,
        ease: 'back.out(1.3)',
      }
    )
  })
}

// FLIP：把出牌（已渲染在出牌区）从它们在手牌中的旧位置平滑过渡到新位置
// oldRects: { [cardId]: DOMRect }
export function flipPlayed(cardEls, oldRects) {
  cardEls.forEach((el) => {
    if (!el) return
    const id = el.dataset.id
    const old = oldRects[id]
    if (!old) return
    const cur = el.getBoundingClientRect()
    const dx = old.left - cur.left
    const dy = old.top - cur.top
    gsap.fromTo(
      el,
      { x: dx, y: dy, scale: 0.92 },
      { x: 0, y: 0, scale: 1, duration: spd(350) / 1000, ease: 'power2.out' }
    )
  })
}

// 数字插值跳动（RAF），用于 blindScore 累加
export function animateNumber(getFrom, setVal, to, ms, onDone) {
  const from = getFrom()
  const dur = spd(ms)
  const start = performance.now()
  function tick(now) {
    const t = Math.min(1, (now - start) / dur)
    const eased = 1 - Math.pow(1 - t, 3)
    setVal(Math.round(from + (to - from) * eased))
    if (t < 1) requestAnimationFrame(tick)
    else { setVal(to); onDone && onDone() }
  }
  requestAnimationFrame(tick)
}
