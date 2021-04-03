<script>
  import { onMount } from 'svelte'
  import { gsap } from 'gsap'
  import { Draggable } from 'gsap/Draggable'

  import Toppings from './Toppings.svelte'

  gsap.registerPlugin(Draggable)

  let pizza
  let toppings
  $: pizzaOrder = {
    size: 0,
    toppings: [],
  }

  onMount(() => {
    gsap.set(toppings.children, { scale: 0 })
  })

  function checkHit(obj) {
    return obj.hitTest(pizza, '70%')
  }

  function resizePizza(e) {
    const size = e.target.dataset.size
    const resize = size / 10
    gsap.to(pizza, { duration: 1, scale: resize, transformOrigin: 'center' })
    pizzaOrder.size = size
  }

  function addToppings(e) {
    if (pizzaOrder.size === 0) return

    gsap.to('[data-size]', {
      duration: 0.5,
      scale: 0,
      transformOrigin: 'center',
      // stagger: { each: 0.33 },
    })

    gsap.to(toppings.children, { duration: 1, scale: 1 })

    Draggable.create(toppings.children, {
      bounds: document.querySelector('[data-pizzaBox]'),

      onDrag: function (e) {
        checkHit(this)
          ? gsap.to(pizza, { stroke: 'red' })
          : gsap.to(pizza, { stroke: 'none' })
      },

      onDragEnd: function (e) {
        if (checkHit(this)) {
          gsap.to(this.target, {
            duration: 0.25,
            scale: 0,
            transformOrigin: 'center center',
          })

          // make a function that checks what topping based on dataset value?
          // clone the topping svg or just topping?

          const topping = this.target.dataset.topping
          pizzaOrder.toppings = [...pizzaOrder.toppings, topping]
          gsap.to(pizza, { stroke: 'none' })
        } else {
          gsap.to(this.target, { duration: 0.25, x: 0, y: 0 })
        }
      },
    })

    //todo: clean up event listeners?
  }
</script>

<p>{pizzaOrder.toppings}</p>
<div class="grid">
  <svg data-pizzaBox fill="none" viewBox="0 0 360 640" xmlns="http://www.w3.org/2000/svg">
    <path fill="#C4C4C4" d="M0 0h360v60H0z" />
    <path fill="#C4C4C4" d="M0 455h360v185H0z" />

    <g data-next on:click={addToppings}>
      <path fill="#D3FF77" d="M343 30.5a22.5 22.5 0 11-45 0 22.5 22.5 0 0145 0z" />
      <path
        fill="#000"
        d="M306.55 28.5a2 2 0 100 4v-4zm28.41 3.41a2 2 0 000-2.82l-12.72-12.73a2 2 0 10-2.83 2.83l11.31 11.31-11.31 11.31a2 2 0 002.83 2.83l12.72-12.73zm-28.41.59h27v-4h-27v4z" />
    </g>

    //todo remove from svg and make proper grid wrapper
    <g bind:this={pizza}>
      <circle cx="180" cy="251" r="75" fill="#C4C4C4" />
      {#each pizzaOrder.toppings as topping}
        <svg
          fill="none"
          x="150"
          y="200"
          xmlns="http://www.w3.org/2000/svg"
          data-pizza={topping}>
          <use href={`./assets/pizza.svg#${topping}`} />
        </svg>
      {/each}
    </g>

    //todo make a component, svg or just div it ?
    <g class="sizes" on:click={resizePizza}>
      <circle data-size="12" cx="66" cy="552" r="30" />
      <circle data-size="15" cx="158.5" cy="551.5" r="40" />
      <circle data-size="20" cx="276" cy="547" r="50" />
    </g>
  </svg>

  <div data-toppings bind:this={toppings}>
    <Toppings topping="ham" />
    <Toppings topping="sausage" />
    <Toppings topping="shrooms" />
    <Toppings topping="pepperonis" />
    <Toppings topping="onion" />
    <Toppings topping="pepper" />
    <Toppings topping="tomato" />
    <Toppings topping="jalapeno" />
  </div>
</div>

<style type="text/scss">
  .grid {
    max-height: 100vh;
    display: grid;
    grid-template-columns: 1fr minmax(360px, 500px) 1fr;
    grid-template-rows: 1fr;
  }

  [data-pizzaBox] {
    // max-height: 100vh;
    grid-column: 2;
    grid-row: 1 / span 2;
  }

  [data-toppings] {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    // grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 1rem;
    grid-row: 2;
    grid-column: 2;
  }

  svg {
    overflow: visible;
  }

  .sizes {
    fill: white;
    stroke: black;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;

    // &-text {
    //   fill: black;
    // }
  }

  [data-size] {
    &:active,
    &:hover {
      fill: red;
    }

    &:focus {
      fill: blue;
    }
  }
</style>
