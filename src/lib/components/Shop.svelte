<script lang="ts">
  export let tokens: number;

  const items = [
    { name: 'Rochester', cost: 6250, limit: 1 },
    { name: '"Battle of Paso de Patria" container', cost: 200, limit: 85 },
    { name: 'Stellar Pioneer permanent camouflage for Benson', cost: 1250, limit: 1 },
    { name: 'Supercontainer', cost: 125, limit: 110 },
    { name: 'Rare expendable bonuses of each type', cost: 125, limit: 50 },
    { name: 'Try for Special armory event', cost: 500, limit: 2 },
    { name: 'Special expendable bonuses of each type', cost: 24, limit: 150 },
    { name: 'Common expendable bonuses of each type', cost: 12, limit: null },
    { name: 'Cosmic Cadet patch', cost: 100, limit: 1 },
    { name: 'Shoot for the Stars flag', cost: 100, limit: 1 },
    { name: 'Signals pack 1', cost: 50, limit: null },
    { name: 'Signals pack 2', cost: 50, limit: null }
  ];

  let cart = {};
  let includeEventPass = false;
  let includeAnniversaryRewards = false;

  $: {
    if (Object.keys(cart).length === 0) {
      cart = items.reduce((acc, item) => {
        acc[item.name] = 0;
        return acc;
      }, {});
    }
  }

  function updateQuantity(itemName: string, newQuantity: number) {
    const item = items.find((i) => i.name === itemName);
    newQuantity = Math.max(0, newQuantity);
    if (item.limit) {
      newQuantity = Math.min(newQuantity, item.limit);
    }
    cart[itemName] = newQuantity;
    cart = { ...cart };
  }

  $: totalCost = Object.entries(cart).reduce((total, [itemName, quantity]) => {
    const item = items.find((i) => i.name === itemName);
    return total + item.cost * quantity;
  }, 0);

  $: extraTokens = (includeEventPass ? 4000 : 0) + (includeAnniversaryRewards ? 1000 : 0);
  $: totalTokens = tokens + extraTokens;
  $: remainingTokens = totalTokens - totalCost;

  $: remainingTokensClass =
    remainingTokens < 0
      ? 'text-red-500'
      : remainingTokens < tokens * 0.1
        ? 'text-yellow-300'
        : 'text-cyan-50';
</script>

<div class="space-y-8">
  <div class="bg-slate-950/50 backdrop-blur-sm rounded p-8">
    <div class="mb-6 flex flex-col space-y-3 text-cyan-100">
      <label class="flex items-center space-x-3 cursor-pointer">
        <div class="relative">
          <input type="checkbox" bind:checked={includeEventPass} class="sr-only" />
          <div
            class="w-6 h-6 bg-cyan-900 rounded-md border border-cyan-700 flex items-center justify-center"
          >
            {#if includeEventPass}
              <svg
                class="w-4 h-4 text-cyan-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            {/if}
          </div>
        </div>
        <span class="text-sm font-medium">Include Event Pass Tokens (+4,000)</span>
      </label>

      <label class="flex items-center space-x-3 cursor-pointer">
        <div class="relative">
          <input type="checkbox" bind:checked={includeAnniversaryRewards} class="sr-only" />
          <div
            class="w-6 h-6 bg-cyan-900 rounded-md border border-cyan-700 flex items-center justify-center"
          >
            {#if includeAnniversaryRewards}
              <svg
                class="w-4 h-4 text-cyan-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            {/if}
          </div>
        </div>
        <span class="text-sm font-medium">Include Tokens from Daily Rewards (+1,000)</span>
      </label>
    </div>

    <table class="w-full text-left mb-6">
      <thead>
        <tr class="text-gray-400 text-lg uppercase">
          <th class="pl-2 py-3 truncate">Item</th>
          <th class="py-3">Cost</th>
          <th class="py-3 hidden sm:visible">Limit</th>
          <th class="py-3">Quantity</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-cyan-800 rounded text-cyan-100">
        {#each items as item}
          <tr class="odd:bg-cyan-950/40">
            <td class="pl-2 py-2.5">{item.name}</td>
            <td class="py-2.5">{item.cost} tokens</td>
            <td class="py-2.5 hidden sm:visible">{item.limit ?? 'Unlimited'}</td>
            <td class="py-2.5">
              <div class="flex items-center space-x-2">
                <button
                  on:click={() => updateQuantity(item.name, cart[item.name] - 1)}
                  disabled={cart[item.name] === 0}
                  class="px-2 py-1 bg-cyan-800 hover:bg-cyan-700 text-cyan-100 rounded-md disabled:bg-cyan-900 disabled:text-cyan-700 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  -
                </button>
                <input
                  type="number"
                  bind:value={cart[item.name]}
                  on:input={(e) => updateQuantity(item.name, parseInt(e.target.value) || 0)}
                  min="0"
                  max={item.limit || undefined}
                  class="w-16 bg-cyan-900/50 text-cyan-100 rounded-md px-2 py-1 text-center"
                />
                <button
                  on:click={() => updateQuantity(item.name, cart[item.name] + 1)}
                  disabled={item.limit && cart[item.name] >= item.limit}
                  class="px-2 py-1 bg-cyan-800 hover:bg-cyan-700 text-cyan-100 rounded-md disabled:bg-cyan-900 disabled:text-cyan-700 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  +
                </button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    <div class="flex justify-between items-start bg-cyan-800/30 rounded-lg p-4 text-cyan-50">
      <div>
        <h4 class="text-lg text-gray-400 font-semibold uppercase mb-1">Total Cost</h4>
        <p class="text-2xl font-bold">{totalCost} tokens</p>
      </div>
      <div class="text-right">
        <h4 class="text-lg text-gray-400 font-semibold uppercase mb-1">Remaining Tokens</h4>
        <p class="text-2xl font-bold {remainingTokensClass}">
          {remainingTokens} tokens
          {#if remainingTokens < 0}
            <span class="text-sm ml-2 normal-case">(Insufficient funds)</span>
          {/if}
        </p>
        {#if extraTokens > 0}
          <p class="text-sm text-cyan-300 mt-1">
            (Including {extraTokens} extra tokens)
          </p>
        {/if}
      </div>
    </div>
  </div>
</div>
