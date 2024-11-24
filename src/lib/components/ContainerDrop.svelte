<script lang="ts">
  import type { ItemDrop } from '$lib/container';

  let { drop, simulated, count }: { drop: ItemDrop; simulated?: boolean; count?: number } =
    $props();

  let chance = (() => {
    let v = Math.ceil(drop.probability * 100 * 10000) / 10000;

    // correct floating point errors (in a bad way)
    if (v - Math.floor(v) < 0.001) {
      v = Math.floor(v);
    }
    return v;
  })();
</script>

<div
  data-drop-name={drop.name}
  class={`
    drop group w-full sm:w-auto p-2 text-white text-sm flex header items-center justify-between  outline outline-1 outline-slate-600/60 -outline-offset-2

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
    {/if}
  </div>
</div>
