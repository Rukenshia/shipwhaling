<script lang="ts">
  import { onMount } from 'svelte';
  import battleOfSantiago from '$lib/assets/anniversary-2026-battle-of-santiago-container.jpg';
  import blastAndBash from '$lib/assets/anniversary-2026-blast-and-bash.webp';
  import commonEconomicBonuses from '$lib/assets/anniversary-2026-economic-bonuses-common.png';
  import rareEconomicBonuses from '$lib/assets/anniversary-2026-economic-bonuses-rare.png';
  import uncommonEconomicBonuses from '$lib/assets/anniversary-2026-economic-bonuses-uncommon.png';
  import kurama from '$lib/assets/anniversary-2026-kurama.jpg';
  import pressF from '$lib/assets/anniversary-2026-press-f.jpg';
  import redSteelTitan from '$lib/assets/anniversary-2026-red-steel-titan.jpg';
  import signalPackOne from '$lib/assets/anniversary-2026-signal-pack-one.png';
  import signalPackTwo from '$lib/assets/anniversary-2026-signal-pack-two.png';
  import supercontainer from '$lib/assets/anniversary-2026-supercontainer.png';
  import supershipBonusPackage from '$lib/assets/anniversary-2026-supership-bonus-package.png';
  import thisIsFine from '$lib/assets/anniversary-2026-this-is-fine.jpg';
  import { prettyAmount } from '$lib/util';
  import Box from '../Box.svelte';

  type ShopCategory =
    'Ships' | 'Effects & Packages' | 'Containers' | 'Economic Bonuses' | 'Signal Flags';

  interface ShopItem {
    id: string;
    name: string;
    cost: number;
    category: ShopCategory;
    limit?: number;
    image?: string;
    imageFit?: 'contain' | 'cover';
    wide?: boolean;
  }

  interface Props {
    tokens: number;
  }

  const STORAGE_KEY = 'shipwhaling:anniversary-2026:shop-cart';

  const items: ShopItem[] = [
    {
      id: 'kurama',
      name: 'Kurama',
      cost: 11000,
      limit: 1,
      category: 'Ships',
      image: kurama,
      imageFit: 'cover',
      wide: true
    },
    {
      id: 'press-f-effect',
      name: 'Press F enemy destruction effect',
      cost: 2500,
      category: 'Effects & Packages',
      image: pressF,
      imageFit: 'cover'
    },
    {
      id: 'this-is-fine-effect',
      name: 'This is Fine enemy destruction effect',
      cost: 2000,
      category: 'Effects & Packages',
      image: thisIsFine,
      imageFit: 'cover'
    },
    {
      id: 'supership-bonus-package',
      name: 'Bonus Package for Superships',
      cost: 2000,
      limit: 1,
      category: 'Effects & Packages',
      image: supershipBonusPackage
    },
    {
      id: 'enemy-destruction-effects-container',
      name: 'Enemy Destruction Effects container',
      cost: 300,
      limit: 10,
      category: 'Containers'
    },
    {
      id: 'battle-of-santiago-de-cuba-container',
      name: 'Battle of Santiago de Cuba container',
      cost: 150,
      category: 'Containers',
      image: battleOfSantiago,
      imageFit: 'cover'
    },
    {
      id: 'supercontainer',
      name: 'Supercontainer',
      cost: 125,
      limit: 130,
      category: 'Containers',
      image: supercontainer
    },
    {
      id: 'decals-premium-container',
      name: 'Decals Premium container',
      cost: 100,
      category: 'Containers'
    },
    {
      id: 'red-steel-titan-premium-container',
      name: 'Red Steel Titan Premium container',
      cost: 95,
      category: 'Containers',
      image: redSteelTitan,
      imageFit: 'cover'
    },
    {
      id: 'rare-economic-bonus-set',
      name: 'Rare economic bonuses of each type',
      cost: 125,
      limit: 50,
      category: 'Economic Bonuses',
      image: rareEconomicBonuses
    },
    {
      id: 'uncommon-economic-bonus-set',
      name: 'Uncommon economic bonuses of each type',
      cost: 24,
      limit: 150,
      category: 'Economic Bonuses',
      image: uncommonEconomicBonuses
    },
    {
      id: 'common-economic-bonus-set',
      name: 'Common economic bonuses of each type',
      cost: 12,
      category: 'Economic Bonuses',
      image: commonEconomicBonuses
    },
    {
      id: 'signal-pack-one',
      name: 'India Delta, India Yankee, Juliet Yankee Bissotwo, Charlie Kilo, November Foxtrot, Victor Lima, and Mike Yankee Soxisix',
      cost: 50,
      category: 'Signal Flags',
      image: signalPackOne,
      wide: true
    },
    {
      id: 'signal-pack-two',
      name: 'Sierra Bravo, X-Ray Papa Unaone, Juliet Whiskey Unaone, India X-Ray, November Echo Setteseven, Sierra Mike, and Hotel Yankee',
      cost: 50,
      category: 'Signal Flags',
      image: signalPackTwo,
      wide: true
    }
  ];

  const categories: ShopCategory[] = [
    'Ships',
    'Effects & Packages',
    'Containers',
    'Economic Bonuses',
    'Signal Flags'
  ];

  let { tokens }: Props = $props();
  let selectedCategory = $state<ShopCategory>('Ships');
  let cart = $state<Record<string, number>>(createEmptyCart());
  let hydrated = $state(false);

  function createEmptyCart(): Record<string, number> {
    return Object.fromEntries(items.map((item) => [item.id, 0]));
  }

  function normalizeQuantity(item: ShopItem, value: unknown): number {
    const numericValue = Number(value);
    const quantity = Number.isFinite(numericValue) ? Math.max(0, Math.trunc(numericValue)) : 0;
    return item.limit === undefined ? quantity : Math.min(quantity, item.limit);
  }

  function readStoredCart(): Record<string, number> {
    const emptyCart = createEmptyCart();

    try {
      const storedValue = localStorage.getItem(STORAGE_KEY);
      if (!storedValue) return emptyCart;

      const parsedValue: unknown = JSON.parse(storedValue);
      if (!parsedValue || typeof parsedValue !== 'object' || Array.isArray(parsedValue)) {
        return emptyCart;
      }

      const storedCart = parsedValue as Record<string, unknown>;
      return Object.fromEntries(
        items.map((item) => [item.id, normalizeQuantity(item, storedCart[item.id])])
      );
    } catch {
      return emptyCart;
    }
  }

  function updateQuantity(item: ShopItem, value: unknown) {
    cart = { ...cart, [item.id]: normalizeQuantity(item, value) };
  }

  function resetPlan() {
    cart = createEmptyCart();
    localStorage.removeItem(STORAGE_KEY);
  }

  onMount(() => {
    cart = readStoredCart();
    hydrated = true;
  });

  $effect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }
  });

  let selectedItems = $derived(items.filter((item) => item.category === selectedCategory));
  let totalCost = $derived(
    items.reduce((total, item) => total + item.cost * (cart[item.id] ?? 0), 0)
  );
  let remainingTokens = $derived(tokens - totalCost);
  let balanceVariant = $derived(remainingTokens < 0 ? 'error' : 'dark');
  let balanceClass = $derived(
    remainingTokens < 0
      ? 'text-red-400'
      : remainingTokens <= Math.max(tokens * 0.1, 25)
        ? 'text-yellow-300'
        : 'text-emerald-400'
  );
</script>

<div class="flex flex-col gap-8">
  <Box variant="dark" padding="p-0" class="overflow-hidden">
    <div class="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
      <img
        src={blastAndBash}
        alt="Blast & Bash permanent camouflage"
        class="h-full min-h-56 w-full object-cover"
      />
      <div class="flex flex-col justify-center gap-4 p-6 lg:p-8">
        <div>
          <div class="header text-sm font-semibold uppercase tracking-widest text-cyan-300">
            First-battle reward
          </div>
          <h3 class="mt-1 text-3xl font-bold text-white">11th Birthday Gift</h3>
        </div>
        <ul class="list-disc space-y-2 pl-5 text-sm leading-relaxed text-cyan-50/90">
          <li>Happy Blastday enemy destruction effect</li>
          <li>Blast & Bash permanent camouflage</li>
          <li>3 Battle of Santiago de Cuba and 3 Red Steel Titan Premium containers</li>
          <li>11 days of Warships Premium Account</li>
        </ul>
      </div>
    </div>
  </Box>

  <div class="grid grid-cols-1 gap-6 lg:grid-cols-6">
    <div class="flex flex-col gap-2 lg:col-span-1" aria-label="Shop categories">
      {#each categories as category}
        <button
          class="header px-3 py-2 text-left text-sm transition-all backdrop-blur {selectedCategory ===
          category
            ? 'bg-cyan-300/20 text-white outline outline-2 outline-cyan-200/60 -outline-offset-2'
            : 'bg-slate-300/20 text-gray-300 outline outline-2 outline-slate-200/60 -outline-offset-2 hover:bg-slate-600/60'}"
          onclick={() => (selectedCategory = category)}
        >
          {category}
        </button>
      {/each}
    </div>

    <div class="flex flex-col gap-6 lg:col-span-5 lg:border-l lg:border-white/20 lg:pl-6">
      <Box
        uppercase
        variant={balanceVariant}
        class="border border-slate-500/30 backdrop-blur-md transition-colors"
      >
        <div class="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="grid grid-cols-3 gap-4 text-left">
            <div>
              <div class="header text-xs tracking-wide text-gray-400">Available</div>
              <div class="font-sans text-xl font-bold text-white">{prettyAmount(tokens)}</div>
            </div>
            <div>
              <div class="header text-xs tracking-wide text-gray-400">Spending</div>
              <div class="font-sans text-xl font-bold text-white">{prettyAmount(totalCost)}</div>
            </div>
            <div>
              <div class="header text-xs tracking-wide text-gray-400">
                {remainingTokens >= 0 ? 'Remaining' : 'Shortfall'}
              </div>
              <div class="font-sans text-xl font-bold {balanceClass}">
                {prettyAmount(Math.abs(remainingTokens))}
              </div>
            </div>
          </div>
          <button
            class="header border border-white/20 bg-white/10 px-4 py-2 text-xs tracking-wider text-gray-200 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={totalCost === 0}
            onclick={resetPlan}
          >
            Reset plan
          </button>
        </div>
      </Box>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        {#each selectedItems as item (item.id)}
          <Box
            variant="dark"
            padding="p-0"
            class="overflow-hidden backdrop-blur transition-all hover:bg-slate-800/60 {item.wide
              ? 'md:col-span-2'
              : ''}"
          >
            <div class="flex h-full w-full gap-4 p-4">
              <div
                class="flex h-24 w-28 shrink-0 items-center justify-center overflow-hidden bg-slate-950/60 outline outline-1 -outline-offset-1 outline-white/15 {item.wide
                  ? 'md:h-28 md:w-60'
                  : ''}"
              >
                {#if item.image}
                  <img
                    src={item.image}
                    alt={`${item.name} preview`}
                    loading="lazy"
                    decoding="async"
                    class="block h-full w-full {item.imageFit === 'cover'
                      ? 'object-cover'
                      : 'object-contain p-2'}"
                  />
                {:else}
                  <svg aria-hidden="true" viewBox="0 0 64 64" class="h-12 w-12 text-slate-400">
                    <path
                      d="M10 20 32 9l22 11-22 11L10 20Zm0 0v25l22 11V31L10 20Zm44 0v25L32 56V31l22-11Z"
                      fill="none"
                      stroke="currentColor"
                      stroke-linejoin="round"
                      stroke-width="3"
                    />
                  </svg>
                {/if}
              </div>
              <div class="flex min-w-0 flex-1 flex-col justify-between gap-5">
                <div>
                  <h4 class="text-sm font-medium leading-tight text-white">{item.name}</h4>
                  <div class="mt-1 text-xs text-gray-400">
                    {prettyAmount(item.cost)} tokens
                    {#if item.limit !== undefined}
                      <span> · Limit {item.limit}</span>
                    {/if}
                  </div>
                </div>

                <div class="flex items-end justify-between gap-3">
                  <div class="flex items-center gap-2">
                    <button
                      aria-label={`Remove one ${item.name}`}
                      class="flex h-8 w-8 items-center justify-center border border-slate-500/40 bg-slate-600/50 font-bold text-white transition-all hover:bg-slate-500/60 disabled:cursor-not-allowed disabled:text-slate-500"
                      disabled={(cart[item.id] ?? 0) === 0}
                      onclick={() => updateQuantity(item, (cart[item.id] ?? 0) - 1)}
                    >
                      −
                    </button>
                    <input
                      aria-label={`${item.name} quantity`}
                      type="number"
                      value={cart[item.id] ?? 0}
                      min="0"
                      max={item.limit}
                      class="w-16 border border-slate-500/40 bg-slate-700/50 px-2 py-1 text-center font-sans text-sm text-white focus:border-cyan-400/60 focus:outline-none"
                      oninput={(event) =>
                        updateQuantity(
                          item,
                          (event.currentTarget as HTMLInputElement).valueAsNumber
                        )}
                    />
                    <button
                      aria-label={`Add one ${item.name}`}
                      class="flex h-8 w-8 items-center justify-center border border-cyan-500/40 bg-cyan-600/50 font-bold text-white transition-all hover:bg-cyan-500/60 disabled:cursor-not-allowed disabled:border-slate-600/20 disabled:bg-slate-700/30 disabled:text-slate-500"
                      disabled={item.limit !== undefined && (cart[item.id] ?? 0) >= item.limit}
                      onclick={() => updateQuantity(item, (cart[item.id] ?? 0) + 1)}
                    >
                      +
                    </button>
                  </div>
                  {#if (cart[item.id] ?? 0) > 0}
                    <div class="text-right font-sans text-xs font-medium text-cyan-300">
                      {prettyAmount((cart[item.id] ?? 0) * item.cost)}
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          </Box>
        {/each}

        {#if selectedCategory === 'Containers'}
          <a
            href="https://worldofwarships.eu/en/content/contents-and-drop-rates-of-containers/"
            target="_blank"
            rel="noreferrer"
            class="md:col-span-2"
          >
            <Box variant="verydark" class="uppercase">
              <div class="header text-center text-sm tracking-wider text-gray-300">
                View container contents and drop rates
              </div>
            </Box>
          </a>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    margin: 0;
    appearance: none;
  }

  input[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
</style>
