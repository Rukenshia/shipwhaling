<script lang="ts">
  import type { Reward } from '$lib/reward';
  import type { Ship } from '$lib/ship';
  import Box from './Box.svelte';

  type RewardWithShip = Reward & { ship: Ship };

  let {
    rewards,
    selectable = false,
    excludedShipIds = new Set<number>(),
    onShipInclusionChange = () => {}
  }: {
    rewards: RewardWithShip[];
    selectable?: boolean;
    excludedShipIds?: ReadonlySet<number>;
    onShipInclusionChange?: (shipId: number, included: boolean) => void;
  } = $props();

  function romanized(tier: number) {
    return ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', '⭐︎'][tier - 1];
  }
</script>

<Box variant="dark" padding="" class="w-full overflow-y-auto max-h-[30vh]">
  <table class="w-full text-left">
    <thead class="sticky top-0 bg-white">
      <tr class="sticky text-gray-800 text-lg uppercase">
        {#if selectable}
          <th class="px-2 text-center">Include?</th>
        {/if}
        <th class="pl-2">Ship</th>
        <th>
          <span class="hidden sm:inline">Base XP Requirement</span>
          <span class="sm:hidden">BXP</span>
        </th>
        <th class="text-right pr-2">Reward</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-cyan-800 rounded text-cyan-100">
      {#each rewards as reward}
        <tr
          class="odd:bg-cyan-950/40 transition-opacity"
          class:opacity-50={selectable && excludedShipIds.has(reward.ship.id)}
        >
          {#if selectable}
            <td class="px-2 text-center">
              <input
                type="checkbox"
                class="h-4 w-4 cursor-pointer accent-cyan-400"
                checked={!excludedShipIds.has(reward.ship.id)}
                aria-label={`Include ${reward.ship.name} in calculations`}
                onchange={(event) =>
                  onShipInclusionChange(reward.ship.id, event.currentTarget.checked)}
              />
            </td>
          {/if}
          <td class="pl-2">{romanized(reward.ship.tier)} {reward.ship.name}</td>
          <td>{reward.requiredXP}</td>
          <td class="text-right pr-2">
            {reward.amount}
            {reward.resource.name}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</Box>
