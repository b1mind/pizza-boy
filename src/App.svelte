<script>
  import { gsap } from 'gsap'
  import { Draggable } from 'gsap/Draggable'
  import { onMount } from 'svelte'
  import { scaleIn } from './anime'

  import Toppings from './components/Toppings.svelte'

  gsap.registerPlugin(Draggable)

  let pizza
  let toppings
  let size = 1

  $: pizzaOrder = {
    size: 12,
    toppings: [],
    get price() {
      return (this.size + this.toppings.length * 0.75).toFixed(2)
    },
  }

  function sizePizza() {
    pizzaOrder.size = size === 1 ? 12 : size === 2 ? 15 : size === 3 ? 20 : 12

    gsap.to(pizza, {
      duration: 1,
      scale: size >= 2 ? size * 0.6 : 1,
      transformOrigin: 'center',
    })
  }

  function checkRemove(obj) {
    return obj.target.dataset.remove
  }

  function removeTopping(obj) {
    const topping = obj.target.dataset.topping
    pizzaOrder.toppings = pizzaOrder.toppings.filter(t => t !== topping)

    const tl = gsap.timeline().to(obj.target, { opacity: 1 })
    obj.target.dataset.remove = false
  }

  function checkHit(obj) {
    return obj.hitTest(pizza, '70%')
  }

  function handleDragEnd(obj) {
    const tl = gsap
      .timeline()
      .to(obj.target, {
        duration: 0.25,
        scale: 0,
        opacity: 0,
        transformOrigin: 'center',
      })

      .to(obj.target, { duration: 0.1, x: 0, y: 0 })
      .to('#cheese, #crust', { duration: 0.35, stroke: 'none' }, '<')
      .to(obj.target, { duration: 0.25, scale: 1, opacity: 0.25 })

    const topping = obj.target.dataset.topping
    pizzaOrder.toppings = [...pizzaOrder.toppings, topping]

    obj.target.dataset.remove = true
    return tl
  }

  function addToppings(e) {
    Draggable.create(toppings.children, {
      bounds: document.querySelector('main'),

      onPress: function () {
        checkRemove(this) ? removeTopping(this) : false
      },

      onDrag: function () {
        checkHit(this)
          ? gsap.to('#cheese, #crust', { stroke: 'green' })
          : gsap.to('#cheese, #crust', { stroke: 'none' })
      },

      onDragEnd: function () {
        if (checkHit(this)) {
          handleDragEnd(this)
        } else {
          gsap.to(this.target, { duration: 0.25, x: 0, y: 0 })
        }
      },
    })

    return {
      destroy() {
        //? check if this is right way to destroy?
        this.kill()
      },
    }
  }

  onMount(() => {
    addToppings()
  })
</script>

<main>
  <!-- //todo make menu a component -->
  <div class="order">
    <b> PizzaBoy </b>
    <b> Cost: ${pizzaOrder.price} </b>

    <details>
      <summary>Confirm</summary>

      <details-menu>
        <div class="order-summary">
          <b>{pizzaOrder.size} inch pizza with</b>
          <ul>
            <li>cheese</li>

            {#each pizzaOrder.toppings as topping}
              <li>{topping}</li>
            {/each}
          </ul>

          <b>Total: ${pizzaOrder.price} </b>
          <button>Order Now</button>
        </div>
      </details-menu>
    </details>
  </div>

  <div data-pizzaBox>
    <svg
      class="pizza"
      width="155"
      viewBox="0 0 100 100"
      fill="none"
      bind:this={pizza}
    >
      <circle id="crust" cx="50" cy="50" r="50" fill="#C59854" />
      <circle id="cheese" cx="50" cy="50" r="45" fill="#FCF2BC" />

      {#each pizzaOrder.toppings as topping}
        <!-- //todo animation for in/out:action to scaleIn/Out replace use: -->

        <use
          use:scaleIn
          data-pizza={topping}
          href={`./assets/pizza.svg#${topping}`}
        />
      {/each}
    </svg>
  </div>

  <div data-toppings bind:this={toppings}>
    <Toppings topping="ham" />
    <Toppings topping="sausage" />
    <Toppings topping="pepperonis" />
    <Toppings topping="shrooms" />
    <Toppings topping="olives" />
    <Toppings topping="peppers" />
    <Toppings topping="onions" />
    <Toppings topping="jalapinos" />
  </div>

  <div class="sizes">
    <label for="sizeSlider">
      <input
        class="slider"
        name="sizeSlider"
        type="range"
        min="1"
        max="3"
        step="0"
        on:change={sizePizza}
        bind:value={size}
      />
    </label>

    <div class="sizeLabels">
      <b>12"</b>
      <b>15"</b>
      <b>20"</b>
    </div>
  </div>
</main>

<style type="text/scss">
  svg {
    overflow: visible;
  }

  main {
    height: 100%;
    max-height: 100vh;
    padding: 0 0.5rem;
    display: grid;
    grid-template-columns: 1fr minmax(340px, 500px) 1fr;
    grid-template-rows: 0.5fr 4fr 2fr 1fr;
    grid-template-areas:
      '. header .'
      '. pizza .'
      '. toppings .'
      '. slider .';
  }

  .order {
    display: flex;
    justify-content: space-between;
    align-self: center;
    grid-area: header;
    color: white;

    details {
      z-index: 69;
    }

    summary {
      z-index: 420;
    }

    details-menu {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: grid;
      place-content: center;
      background-color: #000000c4;
      z-index: -1;
    }
  }

  .order-summary {
    width: 250px;
    padding: 1rem;
    display: grid;
    background-color: #1b1b1b;
    border: 1px solid #1e1e1e;
    border-radius: 10px;
    // box-shadow: 1rem 1rem 1rem #121212;
  }

  [data-pizzaBox] {
    display: grid;
    grid-column: 2;
    place-content: center;
    grid-area: pizza;
    place-self: center;

    use {
      transform-origin: center center;
    }
  }

  [data-toppings] {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 1rem;
    grid-area: toppings;
    z-index: 0;
  }

  .sizes {
    padding: 1rem 1rem 0 1rem;
    display: grid;
    grid-area: slider;
    align-self: center;
    color: white;

    input,
    label {
      width: 95%;
      justify-self: center;
      cursor: pointer;
    }

    .sizeLabels {
      padding: 0.5rem 0.5rem 0 0.5rem;
      display: flex;
      justify-content: space-between;
      user-select: none;
    }
  }

  //- styles from range.css (better than styling my self? idk...)
  //Todo: convert to scss and clean up styles
  input[type='range'] {
    width: 100%;
    background-color: transparent;
    -webkit-appearance: none;
  }
  input[type='range']:focus {
    outline: none;
  }
  input[type='range']::-webkit-slider-runnable-track {
    background: #46262c;
    border: 0;
    border-radius: 18.5px;
    width: 100%;
    height: 24.5px;
    cursor: pointer;
  }
  input[type='range']::-webkit-slider-thumb {
    margin-top: 0px;
    width: 34px;
    height: 25px;
    background: rgba(255, 55, 56, 0.93);
    border: 2.9px solid #941e00;
    border-radius: 28px;
    cursor: pointer;
    -webkit-appearance: none;
  }
  input[type='range']:focus::-webkit-slider-runnable-track {
    background: #572f36;
  }
  input[type='range']::-moz-range-track {
    background: #46262c;
    border: 0;
    border-radius: 18.5px;
    width: 100%;
    height: 24.5px;
    cursor: pointer;
  }
  input[type='range']::-moz-range-thumb {
    width: 34px;
    height: 25px;
    background: rgba(255, 55, 56, 0.93);
    border: 2.9px solid #941e00;
    border-radius: 28px;
    cursor: pointer;
  }
  input[type='range']::-ms-track {
    background: transparent;
    border-color: transparent;
    border-width: 0 0;
    color: transparent;
    width: 100%;
    height: 24.5px;
    cursor: pointer;
  }
  input[type='range']::-ms-fill-lower {
    background: #351d22;
    border: 0;
    border-radius: 37px;
  }
  input[type='range']::-ms-fill-upper {
    background: #46262c;
    border: 0;
    border-radius: 37px;
  }
  input[type='range']::-ms-thumb {
    width: 34px;
    height: 25px;
    background: rgba(255, 55, 56, 0.93);
    border: 2.9px solid #941e00;
    border-radius: 28px;
    cursor: pointer;
    margin-top: 0px;
    /*Needed to keep the Edge thumb centred*/
  }
  input[type='range']:focus::-ms-fill-lower {
    background: #46262c;
  }
  input[type='range']:focus::-ms-fill-upper {
    background: #572f36;
  }
  /*TODO: Use one of the selectors from https://stackoverflow.com/a/20541859/7077589 and figure out
how to remove the virtical space around the range input in IE*/
  @supports (-ms-ime-align: auto) {
    /* Pre-Chromium Edge only styles, selector taken from hhttps://stackoverflow.com/a/32202953/7077589 */
    input[type='range'] {
      margin: 0;
      /*Edge starts the margin from the thumb, not the track as other browsers do*/
    }
  }
</style>
