<script lang="ts">
  import { fade } from 'svelte/transition';
  import GamblingSimulator from './GamblingSimulator.svelte';
  import { onMount } from 'svelte';
  import type { Ship } from '$lib/ship';
  import { SantasGiftContainer2026 } from '$lib/containers/2026-santas-gift-container';
  import { SantasMegaGiftContainer2026 } from '$lib/containers/2026-santas-mega-gift-container';
  import { SantasUltraGiftContainer2026 } from '$lib/containers/2026-santas-ultra-gift-container';
  import { GoldenContainer2026 } from '$lib/containers/2026-golden-container';
  import { BattleForgedPremiumContainer2026 } from '$lib/containers/2026-battle-forged-premium-container';

  interface Props {
    shipsInPort: Ship[];
  }

  let { shipsInPort }: Props = $props();

  let readAndUnderstood = $state(false);
  let mounted = $state(false);

  function didReadAndUnderstand() {
    readAndUnderstood = true;
    localStorage.setItem('readAndUnderstood-christmas2026', 'true');
  }

  onMount(() => {
    readAndUnderstood =
      (localStorage.getItem('readAndUnderstood-christmas2026') || false) === 'true';
    mounted = true;
  });
</script>

<div class="p-2" class:relative={mounted && !readAndUnderstood}>
  <aside
    aria-label="Preliminary container rules"
    class="mb-4 flex items-start gap-3 border border-amber-200/15 border-l-2 border-l-amber-300/70 bg-slate-950/40 px-4 py-3 backdrop-blur"
  >
    <svg
      class="mt-0.5 h-5 w-5 shrink-0 text-amber-200/80"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-3a1 1 0 1 0-2 0 1 1 0 0 0 2 0ZM9 9a1 1 0 0 0 0 2v2a1 1 0 1 0 0 2h1a1 1 0 1 0 0-2v-3a1 1 0 0 0-1-1Z"
        clip-rule="evenodd"
      />
    </svg>
    <div class="min-w-0 space-y-1 text-sm leading-relaxed">
      <p class="font-semibold text-amber-100">Preliminary rules</p>
      <p class="text-slate-300">
        Contents and rules may change during testing. Ship guarantee limits still use last year's
        values: <span class="text-slate-100"
          >Santa's Gift: 100 openings, Mega: 15, Ultra: 7, Golden Gift: 10</span
        >. These limits are not confirmed in the
        <a
          href="https://blog.worldofwarships.com/blog/closed-test-1511-new-year-celebrations-santas-gifts-and-the-ice-station-port"
          target="_blank"
          rel="noreferrer"
          class="text-amber-100 underline decoration-amber-200/40 underline-offset-2 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
          >Update 15.11 announcement</a
        >.
      </p>
    </div>
  </aside>
  <GamblingSimulator
    {shipsInPort}
    containers={[
      SantasGiftContainer2026,
      SantasMegaGiftContainer2026,
      SantasUltraGiftContainer2026,
      GoldenContainer2026,
      BattleForgedPremiumContainer2026
    ]}
  />
  {#if mounted && !readAndUnderstood}
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
