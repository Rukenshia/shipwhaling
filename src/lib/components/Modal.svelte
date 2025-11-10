<script lang="ts">
  let {
    children,
    open = $bindable(false)
  }: {
    children?: import('svelte').Snippet;
    open?: boolean;
  } = $props();

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      open = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      open = false;
    }
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    onclick={handleBackdropClick}
    onkeydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div
      class="relative max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 text-white p-6 outline outline-2 outline-slate-600/60 -outline-offset-2 shadow-2xl"
    >
      <button
        class="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors p-2"
        onclick={() => (open = false)}
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div class="pr-8">
        {@render children?.()}
      </div>
    </div>
  </div>
{/if}
