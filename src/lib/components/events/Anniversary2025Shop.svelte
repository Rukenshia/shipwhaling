<script lang="ts">
  import { prettyAmount } from '$lib/util';
  import Box from '../Box.svelte';

  interface ShopItem {
    name: string;
    title?: () => string;
    cost: number;
    limit?: number;
    icon?: string;
    category?: string;
  }

  interface Props {
    tokens: number;
  }

  let { tokens }: Props = $props();

  // Anniversary 2025 shop items
  const items: ShopItem[] = [
    // Premium ships and special items
    { name: 'Japanese cruiser Kushiro', cost: 10000, limit: 1, category: 'Premium Ships' },
    { name: 'Bonus Package for Tier X ships', cost: 1500, limit: 1, category: 'Special Items' },
    {
      name: '"This is Fine" enemy destruction effect',
      cost: 2000,
      category: 'Special Items'
    },

    // Containers
    { name: 'Finest Hour container', cost: 150, category: 'Containers' },
    { name: '"Resolute and Rapid" container', cost: 450, category: 'Containers' },
    { name: '"The Age of Sa Zhenbing" container', cost: 450, category: 'Containers' },
    { name: 'Battle of Paso de Patria container', cost: 150, category: 'Containers' },
    { name: 'Supercontainer', cost: 125, limit: 130, category: 'Containers' },

    // Economic bonuses
    {
      name: 'Rare economic bonuses of each type',
      cost: 125,
      limit: 50,
      category: 'Economic Bonuses',
      title() {
        return '<span class="text-blue-400">Rare</span> economic bonuses of each type';
      }
    },
    {
      name: 'Special economic bonuses of each type',
      cost: 24,
      limit: 150,
      category: 'Economic Bonuses',
      title() {
        return '<span class="text-emerald-400">Special</span> economic bonuses of each type';
      }
    },
    { name: 'Common economic bonuses of each type', cost: 12, category: 'Economic Bonuses' },

    // Signal flags
    {
      name: 'Signal Pack 1 (India Delta, India Yankee, Juliet Yankee Bissotwo, Charlie Kilo, November Foxtrot, Victor Lima, Mike Yankee Soxisix)',
      cost: 50,
      category: 'Signal Flags'
    },
    {
      name: 'Signal Pack 2 (Sierra Bravo, X-Ray Papa Unaone, Juliet Whiskey Unaone, India X-Ray, November Echo Setteseven, Sierra Mike, Hotel Yankee)',
      cost: 50,
      category: 'Signal Flags'
    }
  ];

  let cart = $state<{ [key: string]: number }>({});
  let includeAnniversaryRewards = $state(false);
  let selectedCategory = $state('Premium Ships');

  // Initialize cart when items change
  $effect(() => {
    if (items.length > 0 && Object.keys(cart).length === 0) {
      cart = items.reduce(
        (acc, item) => {
          acc[item.name] = 0;
          return acc;
        },
        {} as { [key: string]: number }
      );
    }
  });

  // Get unique categories in a specific order
  let categories = $derived(
    ['Premium Ships', 'Special Items', 'Containers', 'Economic Bonuses', 'Signal Flags'].filter(
      (category) => items.some((item) => item.category === category)
    )
  );

  // Get items for selected category
  let selectedItems = $derived(items.filter((item) => item.category === selectedCategory));

  function updateQuantity(itemName: string, newQuantity: number) {
    const item = items.find((i) => i.name === itemName);
    if (!item) return;

    newQuantity = Math.max(0, newQuantity);
    if (item.limit) {
      newQuantity = Math.min(newQuantity, item.limit);
    }
    cart[itemName] = newQuantity;
    cart = { ...cart };
  }

  let totalCost = $derived(
    Object.entries(cart).reduce((total, [itemName, quantity]) => {
      const item = items.find((i) => i.name === itemName);
      return total + (item?.cost || 0) * quantity;
    }, 0)
  );

  let extraTokens = $derived(includeAnniversaryRewards ? 2000 : 0);
  let totalTokens = $derived(tokens + extraTokens);
  let remainingTokens = $derived(totalTokens - totalCost);
  let boxVariant = $derived(remainingTokens < 0 ? 'error' : 'dark');

  let remainingTokensClass = $derived(
    remainingTokens < 0
      ? 'text-red-400'
      : remainingTokens < tokens * 0.1
        ? 'text-yellow-300'
        : 'text-emerald-400'
  );
</script>

<div class="flex flex-col gap-6">
  <div class="w-full grid grid-cols-6 divide-white/20 gap-6">
    <!-- Left sidebar with categories and controls -->
    <div class="col-span-6 lg:col-span-1 flex flex-col gap-4">
      <!-- Category tabs -->
      <div class="grid grid-cols-2 lg:grid-cols-1 gap-2">
        {#each categories as category}
          <button
            class="header text-sm px-3 py-2 transition-all backdrop-blur {selectedCategory ===
            category
              ? 'bg-emerald-300/20 text-white outline outline-2 outline-emerald-200/60 -outline-offset-2'
              : 'bg-slate-300/20 text-gray-300 outline outline-2 outline-slate-200/60 -outline-offset-2 hover:bg-slate-600/60'}"
            onclick={() => (selectedCategory = category)}
          >
            {category}
          </button>
        {/each}

        <label class="mt-4 flex items-center gap-2 cursor-pointer group text-gray-100">
          <div class="relative">
            <input type="checkbox" bind:checked={includeAnniversaryRewards} class="sr-only" />
            <div
              class="w-4 h-4 bg-slate-700/50 border-2 border-slate-500/60 backdrop-blur rounded flex items-center justify-center transition-all group-hover:border-emerald-400/60 {includeAnniversaryRewards
                ? 'bg-emerald-500/20 border-emerald-400/80'
                : ''}"
            >
              {#if includeAnniversaryRewards}
                <svg
                  class="w-2.5 h-2.5 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              {/if}
            </div>
          </div>
          <span class="text-xs font-medium uppercase tracking-wide header">
            Daily rewards (+2,000)
          </span>
        </label>
      </div>
    </div>

    <!-- Right side with items -->
    <div class="col-span-6 lg:col-span-5 flex flex-col gap-6 lg:border-l pl-0 lg:pl-6">
      <div class="w-full grid grid-cols-1 xl:grid-cols-1 gap-6">
        <!-- Cart summary sidebar -->
        <div class="xl:col-span-full">
          <div class="sticky top-4">
            <Box
              uppercase
              variant={boxVariant}
              class="backdrop-blur-md border border-slate-500/3 transition-colors"
            >
              <div class="md:py-3 text-right">
                <!-- Cart total -->
                <div class="flex w-full gap-2 md:gap-4 items-baseline">
                  <div class="text-sm text-gray-300 uppercase tracking-wide font-medium header">
                    Spending
                  </div>
                  <div class="flex items-baseline justify-center gap-2">
                    <div class="md:text-3xl font-sans font-bold text-white">
                      {prettyAmount(totalCost)}
                    </div>
                    <div class="text-sm text-gray-400">
                      <span class="font-medium tracking-wide">tokens</span>
                    </div>
                  </div>
                  <div class="text-xs flex items-baseline justify-center gap-1">
                    <div class="font-sans font-bold {remainingTokensClass}">
                      {prettyAmount(Math.abs(remainingTokens))}
                    </div>
                    <div class="text-xs text-gray-400">
                      {remainingTokens >= 0 ? 'remaining' : 'too many'}
                    </div>
                  </div>
                </div>
              </div>
            </Box>
          </div>
        </div>

        <!-- Items section -->
        <div class="w-full flex flex-col gap-6">
          <!-- Items grid -->
          <div class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
            {#each selectedItems as item (item.name)}
              <div>
                <Box variant="dark" class="backdrop-blur hover:bg-slate-800/60 transition-all">
                  <div class="w-full justify-between flex md:flex-col gap-4">
                    <!-- Item header -->
                    <div class="flex items-start gap-3">
                      {#if item.icon}
                        <img src={item.icon} alt={item.name} class="w-6 h-6 flex-shrink-0" />
                      {/if}
                      <div class="flex-grow min-w-0">
                        <h4 class="text-white font-medium text-sm leading-tight break-words">
                          {#if item.title}
                            {@html item.title()}
                          {:else}
                            {item.name}
                          {/if}
                        </h4>
                        <div class="text-xs text-gray-400 mt-1">
                          {prettyAmount(item.cost)} tokens
                          {#if item.limit}
                            • Limit: {item.limit}
                          {/if}
                        </div>
                      </div>
                    </div>

                    <!-- Quantity controls -->
                    <div class="flex flex-col md:flex-row items-end md:items-center gap-2">
                      <div class="flex items-center gap-2">
                        <button
                          onclick={() => updateQuantity(item.name, (cart[item.name] || 0) - 1)}
                          disabled={!cart[item.name] || cart[item.name] === 0}
                          class="w-7 h-7 bg-slate-600/50 hover:bg-slate-500/60 text-white backdrop-blur border border-slate-500/40 hover:border-slate-400/60 disabled:bg-slate-700/30 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border-slate-600/20 transition-all flex items-center justify-center text-sm font-bold"
                        >
                          −
                        </button>

                        <input
                          type="number"
                          bind:value={cart[item.name]}
                          oninput={(e) =>
                            updateQuantity(
                              item.name,
                              parseInt((e.target as HTMLInputElement)?.value) || 0
                            )}
                          min="0"
                          max={item.limit || undefined}
                          class="w-8 md:w-16 flex-grow bg-slate-700/50 text-white backdrop-blur border border-slate-500/40 px-2 py-1 text-center font-sans focus:border-emerald-400/60 focus:outline-none transition-colors text-sm"
                        />

                        <button
                          onclick={() => updateQuantity(item.name, (cart[item.name] || 0) + 1)}
                          disabled={!!(item.limit && cart[item.name] >= item.limit)}
                          class="w-7 h-7 bg-emerald-600/50 hover:bg-emerald-500/60 text-white backdrop-blur border border-emerald-500/40 hover:border-emerald-400/60 disabled:bg-slate-700/30 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border-slate-600/20 transition-all flex items-center justify-center text-sm font-bold"
                        >
                          +
                        </button>
                      </div>

                      {#if cart[item.name] > 0}
                        <div
                          class="w-full text-xs text-emerald-400 font-medium font-sans text-center"
                        >
                          Subtotal: {prettyAmount((cart[item.name] || 0) * item.cost)}
                        </div>
                      {/if}
                    </div>
                  </div>
                </Box>
              </div>
            {/each}

            {#if selectedCategory === 'Containers'}
              <a
                href="https://worldofwarships.eu/en/content/contents-and-drop-rates-of-containers/"
                target="_blank"
                class="col-span-full"
              >
                <Box variant="verydark" class="uppercase">
                  <div
                    class="tracking-wider text-center text-sm text-gray-300 flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                      />
                    </svg>
                    View container contents and drop rates
                  </div>
                </Box>
              </a>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Remove number input spinners */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
</style>
