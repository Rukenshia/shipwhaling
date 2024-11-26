<script lang="ts">
  let { rewards } = $props();

  function romanized(tier: number) {
    return ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', '⭐︎'][tier - 1];
  }
</script>

<div class="bg-slate-950/50 backdrop-blur-sm rounded p-2 sm:p-8">
  <div class="w-full overflow-y-auto max-h-[30vh] pr-2">
    <table class="w-full text-left">
      <thead class="sticky top-0 bg-cyan-950">
        <tr class="sticky text-gray-300 text-lg uppercase">
          <th class="pl-2">Ship</th>
          <th>
            <span class="hidden sm:inline">Base XP Requirement</span>
            <span class="sm:hidden">BXP</span>
          </th>
          <th class="text-right">Reward</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-cyan-800 rounded text-cyan-100">
        {#each rewards as reward}
          <tr class="odd:bg-cyan-950/40">
            <td class="pl-2">{romanized(reward.ship.tier)} {reward.ship.name}</td>
            <td>{reward.requiredXP}</td>
            <td class="text-right">
              {reward.amount}
              {reward.resource.name}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  /* width */
  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    @apply bg-cyan-950 rounded-lg;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    @apply bg-cyan-300/50 rounded-lg;
  }
</style>
