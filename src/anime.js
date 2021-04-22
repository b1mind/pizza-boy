import { gsap } from 'gsap'

export function animate(node, { type, ...args }) {
  let method = gsap[type]
  let newAnimate = method(node, args)

  return {
    newAnimate,
    destroy() {
      newAnimate.kill()
    },
  }
}

const duration = 1

export function scaleIn(node) {
  const tl = gsap.timeline()
  tl.from(node, {
    duration: duration * 0.5,
    scale: 0,
    transformOrigin: '50% 50%',
  })

  //todo need to fix timing to match Svelte review forum post/repl
  return {
    tl,
    destroy() {
      tl.kill()
    },
  }
}

export function killTimeline(timeline) {
  const targets = timeline.getChildren()

  timeline.kill()

  for (let i = 0; i < targets.length; i++) {
    if (targets[i].targets().length) {
      gsap.set(targets[i].targets(), { clearProps: 'all' })
    }
  }
}
