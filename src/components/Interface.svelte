<script>
  import { gsap } from 'gsap'
  import { Draggable } from 'gsap/Draggable'
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'
  import { animate, scaleIn } from '../anime'

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
    return obj.hitTest(pizza, '80%')
  }

  function sizePizza(e) {
    console.dir(e.target)
    pizzaOrder.size = size === 1 ? 12 : size === 2 ? 15 : size === 3 ? 20 : 12

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
          ? gsap.to(pizza, { stroke: 'green' })
          : gsap.to(pizza, { stroke: 'none' })
      },

      onDragEnd: function (e) {
        if (checkHit(this)) {
          gsap.to(this.target, {
            duration: 0.25,
            scale: 0,
            transformOrigin: 'center',
          })

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
    window.scrollTo(0, 9999)
  })
</script>

<main class="grid">
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
        <use
          use:scaleIn
          class="stagger"
          data-pizza={topping}
          href={`./assets/pizza.svg#${topping}`}
        />
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
    <div class="sizeLabels">
      <b>12"</b>
      <b>15"</b>
      <b>20"</b>
    </div>
  </div>

  <div data-toppings bind:this={toppings}>
    <Toppings topping="ham" />
    <Toppings topping="sausage" />
    <Toppings topping="pepperonis" />
    <Toppings topping="shrooms" />
    <Toppings topping="onion" />
    <Toppings topping="pepper" />
    <Toppings topping="tomato" />
    <Toppings topping="jalapeno" />
  </div>
</main>

<style type="text/scss">
  .order {
    grid-area: header;
    color: white;
  }

  .grid {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr minmax(360px, 500px) 1fr;
    grid-template-rows: 40px 4fr 2fr 0.5fr;
    grid-template-areas:
      '. header .'
      '. pizza .'
      '. toppings .'
      '. slider .';
  }

  [data-pizzaBox] {
    display: grid;
    grid-column: 2;
    place-content: center;
    grid-area: pizza;
    align-self: center;
  }

  .sizes {
    display: grid;
    grid-area: slider;
    align-self: center;
    color: white;

    input {
      width: 95%;
      justify-self: center;
    }

    .sizeLabels {
      display: flex;
      justify-content: space-between;
    }

    b {
      padding-left: 0.5rem;
    }

    b + b {
      padding-left: 1rem;
    }
  }

  [data-toppings] {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 1rem;
    grid-area: toppings;
  }

  svg {
    overflow: visible;
  }
</style>
