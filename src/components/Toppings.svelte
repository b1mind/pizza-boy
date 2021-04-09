<script>
  export let topping = 'ham'
  let useTopping = `./assets/toppings.svg#${topping}`

  //fixme need to be able to pass this to class not as prop
  let remove = false
</script>

<svg
  fill="none"
  viewBox="0 0 50 50"
  xmlns="http://www.w3.org/2000/svg"
  width="100%"
  data-topping={topping}
  data-remove="false"
  class:remove
>
  <use href={useTopping} />
</svg>

<style>
  .remove {
    border: 1px solid red;
  }
</style>
