import { gsap } from 'gsap'

export function animate(node, { type, ...args }) {
  let method = gsap[type]
  let newAnimate = method(node, args)

  return {
    newAnimate,
    destroy() {
      console.log('do I need destroyed')
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
