<script lang="ts">
  import Box from './Box.svelte';

  let {
    title,
    isOpen = false,
    children
  } = $props<{
    title: string;
    isOpen?: boolean;
    children: any;
  }>();

  let collapsed = $state(!isOpen);

  function toggle() {
    collapsed = !collapsed;
  }
</script>

<Box variant="verylight" class="overflow-hidden" padding="">
  <div class="w-full">
    <button
      onclick={toggle}
      class="w-full flex items-center justify-between p-4 text-left transition-colors"
    >
      <span class="font-semibold text-cyan-100">{title}</span>
      <svg
        class="w-5 h-5 text-cyan-300 transition-transform duration-200 {collapsed
          ? ''
          : 'rotate-180'}"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
      class="overflow-hidden transition-all duration-300 ease-in-out {collapsed
        ? 'max-h-0'
        : 'max-h-screen'}"
    >
      <div class="p-4 pt-0">
        {@render children()}
      </div>
    </div>
  </div>
</Box>
