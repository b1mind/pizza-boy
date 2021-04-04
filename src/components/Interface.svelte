<script>
  import { gsap } from 'gsap'
  import { Draggable } from 'gsap/Draggable'
  import { onMount } from 'svelte'

  import Toppings from './Toppings.svelte'

  gsap.registerPlugin(Draggable)

  let pizza
  let toppings
  let size = 1

  $: pizzaOrder = {
    size: 12,
    toppings: [],
  }

  function checkHit(obj) {
    return obj.hitTest(pizza, '70%')
  }

  function sizePizza(e) {
    console.dir(e.target)
    pizzaOrder.size = size === 1 ? 12 : size === 2 ? 15 : size === 3 ? 20 : 0

    gsap.to(pizza, {
      duration: 1,
      scale: size >= 2 ? size * 0.75 : 1,
      transformOrigin: 'center',
    })
  }

  function addToppings(e) {
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

  onMount(() => {
    addToppings()
  })
</script>

<div class="grid">
  <div class="order">
    Order: {pizzaOrder.size}inch pizza with {pizzaOrder.toppings}
  </div>

  <div data-pizzaBox>
    <svg
      bind:this={pizza}
      width="150"
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

  <div class="sizes">
    <input
      type="range"
      min="1"
      max="3"
      step="0"
      on:change={sizePizza}
      bind:value={size}
    />
  </div>

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
  .order {
    display: flex;
    justify-content: space-between;
    grid-area: header;
    color: white;
  }

  .grid {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr minmax(360px, 500px) 1fr;
    grid-template-areas:
      '. header . '
      '. pizza .'
      '. slider .'
      '. toppings .';
  }

  [data-pizzaBox] {
    max-height: 300px;
    display: grid;
    grid-column: 2;
    place-content: center;
    grid-area: pizza;
    align-self: flex-start;
  }

  .sizes {
    grid-area: slider;
    align-self: center;
    input {
      width: 100%;
    }
  }

  [data-toppings] {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    // grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 1rem;
    grid-row: 2;
    grid-column: 2;
    grid-area: toppings;
  }

  svg {
    overflow: visible;
  }
</style>
