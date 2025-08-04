<script lang="ts">
  import Box from './Box.svelte';

  let { rewards, title = 'Rewards' } = $props();

  function romanized(tier: number) {
    return ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', '⭐︎'][tier - 1];
  }
</script>

<Box variant="dark" padding="" class="w-full overflow-y-auto max-h-[30vh]">
  <table class="w-full text-left">
    <thead class="sticky top-0 bg-white">
      <tr class="sticky text-gray-800 text-lg uppercase">
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
        <tr class="odd:bg-cyan-950/40">
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
