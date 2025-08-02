<script lang="ts">
  import { fade } from 'svelte/transition';
  import GamblingSimulator from '../../GamblingSimulator.svelte';
  import { onMount } from 'svelte';
  import type { Ship } from '$lib/ship';

  let shipsInPort = $props<{
    shipsInPort: Ship[];
  }>();

  let readAndUnderstood = $state(false);

  function didReadAndUnderstand() {
    readAndUnderstood = true;
    localStorage.setItem('readAndUnderstood', 'true');
  }

  onMount(() => {
    readAndUnderstood = (localStorage.getItem('readAndUnderstood') || false) === 'true';
  });
</script>

<div class="p-2" class:relative={!readAndUnderstood}>
  <GamblingSimulator {shipsInPort} />
  {#if !readAndUnderstood}
    <div
      transition:fade
      class="backdrop-blur-sm bg-slate-900/60 absolute top-0 left-0 w-full h-full
            flex items-start xl:items-center justify-center py-16 xl:py-0
            z-50"
    >
      <div class="flex flex-col gap-8 max-w-xl text-xl">
        <span
          >You can view container drop rates and pretend to open them here. <strong
            >This is not fully accurate</strong
          >, for example guaranteed drops are not implemented. Open the real containers in the game
          to get the real rewards with the correct mechanics.</span
        >
        <button
          onclick={didReadAndUnderstand}
          class="
                  items-center
                  justify-center
                  xl:justify-start
                  header gambling-button
                  px-8 py-4 transition-all
                  backdrop-blur

                  bg-emerald-300/20 text-white
                  outline outline-2 outline-emerald-200/60 -outline-offset-2
                  disabled:bg-emerald-800/40 disabled:text-emerald-300

                  hover:bg-emerald-600/60
                  uppercase text-2xl font-medium
                  flex flex-col gap-4"
        >
          I understand that this is not real</button
        >
      </div>
    </div>
  {/if}
</div>
