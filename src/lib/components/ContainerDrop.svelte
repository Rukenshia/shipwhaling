<script lang="ts">
  import type { Item, ItemDrop } from '$lib/container';
  import { prettyAmount } from '$lib/util';
  import Tooltip from './Tooltip.svelte';
  import Modal from './Modal.svelte';
  import warships from '$lib/assets/warships.json';
  import type { Ship } from '$lib/ship';

  let { drop, simulated, count }: { drop: ItemDrop; simulated?: boolean; count?: number } =
    $props();

  let modalOpen = $state(false);

  let chance = (() => {
    let v = Math.ceil(drop.probability * 100 * 10000) / 10000;

    // correct floating point errors (in a bad way)
    if (v - Math.floor(v) < 0.001) {
      v = Math.floor(v);
    }
    return v;
  })();

  let conditionalChance = (() => {
    if (drop.conditionalProbability === undefined) {
      return undefined;
    }

    let v = Math.ceil(drop.conditionalProbability * 100 * 10000) / 10000;

    // correct floating point errors (in a bad way)
    if (v - Math.floor(v) < 0.001) {
      v = Math.floor(v);
    }
    return v;
  })();

  const shipTier = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', '⭐︎'];
</script>

<Tooltip>
  <button
    data-drop-name={drop.name}
    onclick={() => (modalOpen = true)}
    class={`
    drop group w-full p-2 text-white text-sm flex header items-center justify-between  outline outline-1 outline-slate-600/60 -outline-offset-2 cursor-pointer hover:bg-slate-700/40 transition-colors

    ${simulated && count ? 'bg-emerald-600/60 outline-white/40' : 'bg-slate-800/30'}
    `}
  >
    <div>
      {drop.name}
      {#if drop.items.length === 0}
        <span class="text-red-500"> (compensation)</span>
      {/if}
    </div>
    <div
      class="text-gray-400 group-data-[drop-active=true]:text-white"
      class:text-white={simulated && count}
    >
      {#if simulated}
        {count}x
      {:else}
        {chance}%
        {#if conditionalChance !== undefined}
          <span class="text-cyan-400">({conditionalChance}%)</span>
        {/if}
      {/if}
    </div>
  </button>

  {#snippet tooltip()}
    <div class="text-gray-400 text-xs mb-2 italic">Click for more details</div>

    {#if drop.condition}
      <div class="text-cyan-500 mb-4">{drop.condition}</div>
    {/if}

    You can get the following {drop.type}s:

    <ul class="list-disc list-inside">
      {#each drop.items as item}
        <li>
          {#if item.ship}
            {shipTier[item.ship.tier - 1]}
          {/if}
          {#if item.amount > 1}
            {prettyAmount(item.amount)}x
          {/if}
          {item.name}
        </li>
      {/each}
    </ul>
  {/snippet}
</Tooltip>

<Modal bind:open={modalOpen}>
  <h2 class="text-2xl font-bold mb-4 header">{drop.name}</h2>
  
  {#if drop.condition}
    <div class="text-cyan-500 mb-4 text-lg">{drop.condition}</div>
  {/if}

  <div class="mb-4">
    <div class="text-gray-400 mb-2">Drop Probability:</div>
    <div class="text-xl text-white">
      {chance}%
      {#if conditionalChance !== undefined}
        <span class="text-cyan-400 text-base ml-2">(Conditional: {conditionalChance}%)</span>
      {/if}
    </div>
  </div>

  <div>
    <div class="text-gray-400 mb-2">You can get the following {drop.type}s:</div>
    <ul class="list-disc list-inside space-y-1 text-base">
      {#each drop.items as item}
        <li>
          {#if item.ship}
            <span class="text-yellow-400">{shipTier[item.ship.tier - 1]}</span>
          {/if}
          {#if item.amount > 1}
            <span class="text-emerald-400">{prettyAmount(item.amount)}x</span>
          {/if}
          {item.name}
        </li>
      {/each}
    </ul>
  </div>
</Modal>
