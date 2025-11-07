<script lang="ts">
  import { fade } from 'svelte/transition';
  import GamblingSimulator from './GamblingSimulator.svelte';
  import { onMount } from 'svelte';
  import type { Ship } from '$lib/ship';

  interface Props {
    shipsInPort: Ship[];
  }

  let { shipsInPort }: Props = $props();

  let readAndUnderstood = $state(false);

  function didReadAndUnderstand() {
    readAndUnderstood = true;
    localStorage.setItem('readAndUnderstood-christmas2025', 'true');
  }

  onMount(() => {
    readAndUnderstood =
      (localStorage.getItem('readAndUnderstood-christmas2025') || false) === 'true';
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
          >This tool allows you to pretend to open containers, but is <strong
            >not fully accurate or representative of all mechanics</strong
          >. For the full experience and to receive real rewards you will need to open real
          containers within World of Warships.</span
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
