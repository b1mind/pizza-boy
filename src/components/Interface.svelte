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
      transformOrigin: 'center center',
      // stagger: { each: 0.33 },
    })

    gsap.to(toppings.children, { duration: 1, scale: 1 })

    Draggable.create(toppings.children, {
      bounds: document.querySelector('.grid'),

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

<p>{pizzaOrder.size}inch pizza with: {pizzaOrder.toppings}</p>

<button on:click={addToppings}>Next</button>

<div class="grid">
  <!-- //todo remove from svg and make proper grid wrapper -->

  <div data-pizzaBox>
    <svg
      bind:this={pizza}
      width="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle id="crust" cx="50" cy="50" r="50" fill="#C59854" />
      <circle id="cheese" cx="50" cy="50" r="45" fill="#FCF2BC" />

      {#each pizzaOrder.toppings as topping}
        <use data-pizza={topping} href={`./assets/pizza.svg#${topping}`} />
      {/each}
    </svg>
  </div>

  <!-- //todo make a component, svg or just div it ? -->
  <svg data-sizes>
    <g class="sizes" on:click={resizePizza}>
      <circle data-size="12" cx="30" cy="60" r="30" />
      <circle data-size="15" cx="158.5" cy="60" r="40" />
      <circle data-size="20" cx="276" cy="60" r="50" />
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
  p {
    color: white;
  }
  .grid {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr minmax(360px, 500px) 1fr;
  }

  [data-pizzaBox] {
    max-height: 300px;
    display: grid;
    grid-column: 2;
    place-content: center;
  }

  [data-toppings],
  [data-sizes] {
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
