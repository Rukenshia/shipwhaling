<script lang="ts">
  export let size = 'text-2xl';
  export let align = 'text-center';
</script>

<div class="leading-10 pb-4">
  <h1 class={`${align} ${size} text-white font-bold drop-shadow-2xl uppercase`}>
    <slot></slot>
  </h1>

  <h2 class={`${align} text-base sm:text-sm lg:text-lg text-cyan-50/80 drop-shadow-2xl`}>
    <slot name="subtitle"></slot>
  </h2>
</div>
