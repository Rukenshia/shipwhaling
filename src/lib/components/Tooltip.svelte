<script lang="ts">
  let {
    children,
    tooltip
  }: {
    children?: import('svelte').Snippet;
    tooltip?: import('svelte').Snippet;
  } = $props();

  let hovered = $state(false);
  let x = $state(0);
  let y = $state(0);

  function mouseOver(event) {
    hovered = true;
    x = event.pageX;
    y = event.pageY;
  }

  function mouseMove(event) {
    x = event.pageX;
    y = event.pageY;
  }

  function mouseLeave() {
    hovered = false;
  }
</script>

<div
  onmouseover={mouseOver}
  onmousemove={mouseMove}
  onmouseleave={mouseLeave}
  onfocus={mouseOver}
  role="tooltip"
>
  {@render children?.()}
</div>
{#if hovered}
  <div
    class="absolute z-50 px-4 py-2 bg-slate-800/95 text-white text-sm drop-shadow-lg outline outline-1 outline-slate-600/60 -outline-offset-2"
    style="top: {y + 10}px; left: {x + 10}px"
  >
    {@render tooltip?.()}
  </div>
{/if}
