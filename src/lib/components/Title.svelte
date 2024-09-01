<script lang="ts">
  export let size = 'text-2xl';
  export let align = 'text-center';
</script>

<div class="leading-10 pb-4">
  <div class={`header ${align} ${size} text-white font-bold drop-shadow-2xl uppercase`}>
    <slot></slot>
  </div>

  <div class={`header ${align} text-base sm:text-sm lg:text-lg text-cyan-50/80 drop-shadow-2xl`}>
    <slot name="subtitle"></slot>
  </div>
</div>
