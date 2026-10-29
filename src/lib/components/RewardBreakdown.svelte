<script lang="ts">
  import type { Reward } from '$lib/reward';
  import type { Ship } from '$lib/ship';
  import { prettyAmount } from '$lib/util';
  import Box from './Box.svelte';

  type RewardWithShip = Reward & { ship: Ship };

  let {
    rewards,
    selectable = false,
    excludedShipIds = new Set<number>(),
    onShipInclusionChange = () => {},
    emptyMessage = 'No ships to show.'
  }: {
    rewards: RewardWithShip[];
    selectable?: boolean;
    excludedShipIds?: ReadonlySet<number>;
    onShipInclusionChange?: (shipId: number, included: boolean) => void;
    emptyMessage?: string;
  } = $props();

  function romanized(tier: number) {
    return ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', '⭐︎'][tier - 1];
  }
</script>

<Box variant="dark" padding="p-0" class="overflow-hidden">
  {#if rewards.length === 0}
    <div class="w-full p-6 text-center text-sm text-gray-400">{emptyMessage}</div>
  {:else}
    <div class="w-full">
      <div
        class="header flex items-center gap-3 border-b border-white/10 px-3 py-2 text-xs uppercase tracking-wide text-gray-400 sm:px-4"
      >
        {#if selectable}
          <span class="w-4 shrink-0" aria-hidden="true"></span>
        {/if}
        <span class="min-w-0 flex-1">Ship</span>
        <span class="w-16 text-right sm:w-32">
          <span class="hidden sm:inline">Base XP required</span>
          <span class="sm:hidden">BXP</span>
        </span>
        <span class="w-24 text-right sm:w-28">Reward</span>
      </div>

      <ul class="max-h-[28rem] divide-y divide-white/5 overflow-y-auto">
        {#each rewards as reward (reward.ship.id)}
          {@const excluded = selectable && excludedShipIds.has(reward.ship.id)}
          <li>
            <svelte:element
              this={selectable ? 'label' : 'div'}
              class="flex items-center gap-3 px-3 py-1.5 transition-colors sm:px-4 {selectable
                ? 'cursor-pointer hover:bg-white/5'
                : ''}"
              class:opacity-40={excluded}
            >
              {#if selectable}
                <input
                  type="checkbox"
                  class="h-4 w-4 shrink-0 cursor-pointer accent-emerald-400"
                  checked={!excluded}
                  aria-label={`Include ${reward.ship.name} in calculations`}
                  onchange={(event) =>
                    onShipInclusionChange(reward.ship.id, event.currentTarget.checked)}
                />
              {/if}
              <span class="flex min-w-0 flex-1 items-center gap-3">
                <img
                  src={reward.ship.image}
                  alt=""
                  loading="lazy"
                  class="hidden h-7 w-12 shrink-0 object-contain sm:block"
                />
                <span class="header w-6 shrink-0 text-sm font-semibold text-amber-200"
                  >{romanized(reward.ship.tier)}</span
                >
                <span class="truncate text-sm text-white" class:line-through={excluded}
                  >{reward.ship.name}</span
                >
              </span>
              <span class="w-16 shrink-0 text-right font-sans text-sm text-gray-300 sm:w-32"
                >{prettyAmount(reward.requiredXP)}</span
              >
              <span
                class="flex w-24 shrink-0 items-center justify-end gap-1.5 font-sans text-sm font-semibold text-white sm:w-28"
              >
                {prettyAmount(reward.amount)}
                {#if reward.resource.image}
                  <img
                    src={reward.resource.image}
                    alt={reward.resource.name}
                    title={reward.resource.name}
                    class="h-4 w-4 object-contain"
                  />
                {:else}
                  <span class="font-normal text-gray-400">{reward.resource.name}</span>
                {/if}
              </span>
            </svelte:element>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</Box>
