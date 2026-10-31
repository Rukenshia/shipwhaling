<script lang="ts">
  let {
    children,
    tooltip
  }: {
    children?: import('svelte').Snippet;
    tooltip?: import('svelte').Snippet;
  } = $props();

  const OFFSET = 10;
  const MARGIN = 8;

  let hovered = $state(false);
  let x = $state(0);
  let y = $state(0);
  let width = $state(0);
  let height = $state(0);

  // keep the tooltip inside the viewport, flipping to the other side of the cursor if needed
  let left = $derived(
    x + OFFSET + width > window.innerWidth - MARGIN
      ? Math.max(MARGIN, x - OFFSET - width)
      : x + OFFSET
  );
  let top = $derived(
    y + OFFSET + height > window.innerHeight - MARGIN
      ? Math.max(MARGIN, y - OFFSET - height)
      : y + OFFSET
  );

  // render on <body> so ancestors with backdrop-filter/transform don't become the containing block
  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return {
      destroy() {
        node.remove();
      }
    };
  }

  function mouseOver(event: MouseEvent) {
    hovered = true;
    x = event.clientX;
    y = event.clientY;
  }

  function mouseMove(event: MouseEvent) {
    x = event.clientX;
    y = event.clientY;
  }

  function focus(event: FocusEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    hovered = true;
    x = rect.left;
    y = rect.bottom;
  }

  function mouseLeave() {
    hovered = false;
  }
</script>

<div
  onmouseover={mouseOver}
  onmousemove={mouseMove}
  onmouseleave={mouseLeave}
  onfocus={focus}
  onblur={mouseLeave}
  role="tooltip"
>
  {@render children?.()}
</div>
{#if hovered}
  <div
    use:portal
    bind:offsetWidth={width}
    bind:offsetHeight={height}
    class="pointer-events-none fixed z-50 w-max max-w-[min(28rem,calc(100vw-1rem))] px-4 py-2 bg-slate-800/95 text-white text-sm drop-shadow-lg outline outline-1 outline-slate-600/60 -outline-offset-2"
    style="top: {top}px; left: {left}px"
  >
    {@render tooltip?.()}
  </div>
{/if}
