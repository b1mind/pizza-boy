<script>
  import { gsap } from 'gsap'
  import { Draggable } from 'gsap/Draggable'
  import { onMount } from 'svelte'

  import Toppings from './Toppings.svelte'

  gsap.registerPlugin(Draggable)

  let pizza
  let toppings
  let tempSize = 0
  let sizes = [12, 15, 20]

  $: pizzaOrder = {
    size: 0,
    toppings: [],
  }

  $: gsap.to(pizza, {
    duration: 1,
    scale: pizzaOrder.size / 10,
    transformOrigin: 'center',
  })

  function checkHit(obj) {
    return obj.hitTest(pizza, '70%')
  }

  function onInput() {
    pizzaOrder.size = sizes[tempSize]
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
    <p>{pizzaOrder.size}inch pizza with: {pizzaOrder.toppings}</p>

    <button on:click={addToppings}>Next</button>
  </div>
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

  <!-- //todo make a component, svg or just div it ? or make it a slider -->
  <div class="sizes">
    <input
      type="range"
      min="0"
      max="2"
      step="0"
      on:input={onInput}
      bind:value={tempSize}
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
  p {
    color: white;
  }

  .order {
    display: flex;
    justify-content: space-between;
    grid-area: header;

    button {
      height: min-content;
    }
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
  }

  .sizes {
    grid-area: slider;
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
