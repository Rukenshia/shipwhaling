<script lang="ts">
  import type { ClanBuilding } from '$lib/modifiers';

  let {
    building,
    selected,
    onSelect
  }: {
    building: ClanBuilding;
    selected?: number;
    onSelect: (modifier: number) => void;
  } = $props();
</script>

<div class="w-full flex justify-between items-center outline outline-white/10 bg-slate-900/20">
  <div class="px-2 py-1 bg-slate-800/50 flex-grow">{building.resource.name}</div>
  <div class="font-mono grid grid-cols-4 divide-x divide-white/20">
    {#each building.modifiers as modifier}
      <button
        class={`
          transition-colors
          text-left py-1
          ${selected !== modifier ? 'hover:bg-slate-900/50 active:bg-slate-900/70' : ''}

          ${selected === modifier ? 'bg-emerald-300/20 text-emerald-50 font-semibold' : ''}

          flex items-center justify-center

          px-2

        `}
        onclick={() => onSelect(modifier)}
      >
        <div>{Math.trunc((modifier - 1) * 100)}%</div>
      </button>
    {/each}
  </div>
</div>
