<script lang="ts">
  import { tick } from 'svelte';
  import { scale, slide } from 'svelte/transition';
  import { backOut } from 'svelte/easing';
  import type { Container, Item, ItemDrop, Rarity } from '$lib/container';
  import {
    addLoot,
    createState,
    dropRarity,
    effectiveDrops,
    isOwned,
    isShipDrop,
    roll,
    sortedLoot,
    type Loot,
    type LootEntry,
    type RollResult,
    type SimulatorState
  } from '$lib/containerSimulator';
  import { prettyAmount } from '$lib/util';
  import type { Ship } from '$lib/ship';
  import coalIcon from '$lib/assets/coal.svg';
  import steelIcon from '$lib/assets/steel.svg';
  import goldenGiftIcon from '$lib/assets/golden-gift-container.png';
  import battleForgedIcon from '$lib/assets/christmas2026/battle-forged-premium-container.png';
  import Box from '../Box.svelte';
  import Modal from '../Modal.svelte';
  import CoffeeDrop from './CoffeeDrop.svelte';
  import BonusDrop from './BonusDrop.svelte';
  import { Realm, user } from '$lib/store';
  import flamuuPotato from '$lib/assets/flamuu-potato.png';
  import santaWhale from '$lib/assets/christmas.png';

  let { shipsInPort, containers }: { shipsInPort: Ship[]; containers: Container[] } = $props();

  const MAX_BULK = 100000;
  const OPEN_DURATION = 900;
  // chance per opening action (not per container) to show the coffee easter egg; ?coffee forces it
  const COFFEE_CHANCE = 0.008;
  // a potato from the streamer Flamuu, who always gets one on his first opening and then a lot
  // more often than everyone else; ?potato forces it
  const POTATO_CHANCE = 0.005;
  const FLAMUU_POTATO_CHANCE = 0.05;
  // once per session, for opening a truly absurd number of containers
  const WHALE_OPENED = 10000;
  const GOLDEN_WHALE_OPENED = 100000;

  const rarityStyles: Record<
    Rarity,
    { label: string; text: string; outline: string; bg: string; bar: string; glow: string }
  > = {
    common: {
      label: 'Common',
      text: 'text-slate-200',
      outline: 'outline-slate-300/30',
      bg: 'bg-slate-500/10',
      bar: 'bg-slate-400/70',
      glow: 'shadow-[0_0_40px_-12px_rgba(148,163,184,0.5)]'
    },
    rare: {
      label: 'Rare',
      text: 'text-sky-300',
      outline: 'outline-sky-300/50',
      bg: 'bg-sky-500/10',
      bar: 'bg-sky-400',
      glow: 'shadow-[0_0_48px_-10px_rgba(56,189,248,0.6)]'
    },
    epic: {
      label: 'Epic',
      text: 'text-violet-300',
      outline: 'outline-violet-300/60',
      bg: 'bg-violet-500/15',
      bar: 'bg-violet-400',
      glow: 'shadow-[0_0_56px_-8px_rgba(167,139,250,0.7)]'
    },
    legendary: {
      label: 'Legendary',
      text: 'text-amber-300',
      outline: 'outline-amber-300/70',
      bg: 'bg-amber-500/15',
      bar: 'bg-amber-400',
      glow: 'shadow-[0_0_64px_-6px_rgba(251,191,36,0.8)]'
    }
  };

  const tiers = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', '★'];
  const percent = new Intl.NumberFormat('en-US', { maximumFractionDigits: 3 });

  // svelte-ignore state_referenced_locally
  // raw: roll() reads the drop tables in a hot loop, and deep proxies make bulk opening crawl
  let selectedContainer: Container = $state.raw(containers[0]);
  let sim: SimulatorState = $state.raw(createSimState());
  let version = $state(0);

  let phase: 'idle' | 'opening' = $state('idle');
  let skipAnimation = $state(false);
  let bulkAmount = $state(100);
  let lastResult: RollResult | undefined = $state(undefined);
  let lastBatch:
    | {
        opened: number;
        ships: Item[];
        loot: LootEntry[];
        shipsAvailable: boolean;
        conditionalActive: boolean;
        expectedShips: number;
      }
    | undefined = $state(undefined);
  let openPanel: 'rates' | 'loot' | 'ships' | undefined = $state(undefined);
  let showAllShips = $state(false);
  let revealKey = $state(0);
  let detailsDrop: ItemDrop | undefined = $state(undefined);
  let detailsOpen = $state(false);
  let revealPanel: HTMLElement | undefined = $state(undefined);
  let revealScroll: HTMLElement | undefined = $state(undefined);
  let bonus = $state<{ kind: 'coffee' | 'potato' | 'whale' | 'golden-whale'; key: number }>();
  let coffeeFound = false;
  let potatoFound = false;
  let whaleFound = false;
  let goldenWhaleFound = false;
  let bonusShown = $derived(phase === 'idle' && bonus?.key === revealKey);
  let isFlamuu = $derived($user?.realm === Realm.EU && $user.account_id === '529265619');
  let potatoChance = $derived(isFlamuu ? FLAMUU_POTATO_CHANCE : POTATO_CHANCE);

  // start every new reveal at the top of the scrollable results
  $effect(() => {
    void revealKey;
    if (revealScroll) revealScroll.scrollTop = 0;
  });

  function rollBonus() {
    const params = new URLSearchParams(window.location.search);
    if (!goldenWhaleFound && sim.opened >= GOLDEN_WHALE_OPENED) {
      // one bulk open can cross both thresholds; the golden one wins
      goldenWhaleFound = true;
      whaleFound = true;
      bonus = { kind: 'golden-whale', key: revealKey };
    } else if (!whaleFound && sim.opened >= WHALE_OPENED) {
      whaleFound = true;
      bonus = { kind: 'whale', key: revealKey };
    } else if (params.has('potato') || (isFlamuu && !potatoFound) || Math.random() < potatoChance) {
      potatoFound = true;
      bonus = { kind: 'potato', key: revealKey };
    } else if (params.has('coffee') || (!coffeeFound && Math.random() < COFFEE_CHANCE)) {
      // at most once per page load so it stays a surprise
      coffeeFound = true;
      bonus = { kind: 'coffee', key: revealKey };
    }
  }

  function createSimState() {
    return createState(shipsInPort.map((ship) => ship.name));
  }

  function refresh() {
    version++;
  }

  // Everything below reads `version` so it recalculates after sim is mutated
  let drops = $derived(version >= 0 ? effectiveDrops(selectedContainer, sim.owned) : []);
  let multiSlot = $derived(!!selectedContainer.additionalSlots?.length);
  // Every slot rolls independently, so each one gets its own group (and bar scale) in slot order
  let rateSlots = $derived(
    [
      { name: selectedContainer.mainSlotName ?? 'Slot 1', drops },
      ...(selectedContainer.additionalSlots ?? []).map((slot) => ({
        name: slot.name,
        drops: slot.drops.map((drop) => ({
          drop,
          probability: drop.probability,
          items: drop.items
        }))
      }))
    ]
      .sort(bySlotName)
      .map((slot) => ({
        ...slot,
        maxProbability: Math.max(...slot.drops.map(({ probability }) => probability))
      }))
  );
  let slotResults = $derived.by(() => {
    const result: RollResult | undefined = lastResult;
    if (!result) return [];
    return [
      { name: selectedContainer.mainSlotName ?? 'Slot 1', result },
      ...(result.additionalRewards ?? []).map((extra, i) => ({
        name: selectedContainer.additionalSlots?.[i]?.name ?? `Slot ${i + 2}`,
        result: extra
      }))
    ].sort(bySlotName);
  });
  let stats = $derived.by(() => {
    void version;
    return {
      opened: sim.opened,
      pity: sim.pity,
      counts: { ...sim.counts },
      ships: [...sim.ships].reverse(),
      loot: sortedLoot(sim.loot)
    };
  });
  let guaranteeLeft = $derived(
    drops.some(
      ({ drop, items, probability }) =>
        selectedContainer.guaranteedDropType === 'ship' &&
        isShipDrop(drop) &&
        items.length > 0 &&
        probability > 0
    )
  );
  let untilGuaranteed = $derived(
    selectedContainer.guaranteedDropAfter && guaranteeLeft
      ? Math.max(1, selectedContainer.guaranteedDropAfter - stats.pity)
      : undefined
  );

  function selectContainer(container: Container) {
    if (phase === 'opening' || container === selectedContainer) return;
    selectedContainer = container;
    reset();
  }

  function reset() {
    sim = createSimState();
    whaleFound = false;
    goldenWhaleFound = false;
    lastResult = undefined;
    lastBatch = undefined;
    showAllShips = false;
    refresh();
  }

  function openOne() {
    if (phase === 'opening') return;

    const result = roll(selectedContainer, sim);
    lastBatch = undefined;

    const reveal = () => {
      lastResult = result;
      revealKey++;
      rollBonus();
      showReveal();
      phase = 'idle';
      refresh();
    };

    if (skipAnimation || prefersReducedMotion()) {
      reveal();
      return;
    }

    phase = 'opening';
    setTimeout(reveal, OPEN_DURATION);
  }

  function openMany() {
    if (phase === 'opening') return;

    const amount = Math.min(MAX_BULK, Math.max(1, Math.trunc(bulkAmount) || 1));
    bulkAmount = amount;

    const shipDrops = drops.filter(
      ({ drop, items }) => (drop.type === 'ship' || drop.unique) && items.length > 0
    );
    const shipsBefore = sim.ships.length;
    const loot: Loot = {};
    let result: RollResult | undefined;
    for (let i = 0; i < amount; i++) {
      result = roll(selectedContainer, sim);
      addLoot(loot, result);
    }

    lastResult = result;
    lastBatch = {
      opened: amount,
      ships: sim.ships.slice(shipsBefore),
      loot: sortedLoot(loot),
      shipsAvailable: shipDrops.length > 0,
      conditionalActive: drops.some(
        ({ drop, probability }) =>
          drop.conditionalProbability !== undefined && probability !== drop.probability
      ),
      expectedShips: amount * shipDrops.reduce((sum, { probability }) => sum + probability, 0)
    };
    revealKey++;
    rollBonus();
    refresh();
    showReveal();
  }

  // On narrow screens the result panel sits below the buttons, so bring it into view
  async function showReveal() {
    await tick();
    if (!revealPanel) return;
    const { top, bottom } = revealPanel.getBoundingClientRect();
    if (top < 0 || bottom > window.innerHeight) {
      revealPanel.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'nearest'
      });
    }
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function showDetails(drop: ItemDrop) {
    detailsDrop = drop;
    detailsOpen = true;
  }

  function itemIcon(item: Item | undefined): string | undefined {
    if (!item) return undefined;
    if (item.ship) return item.ship.image;
    if (/golden gift container/i.test(item.name)) return goldenGiftIcon;
    if (/battle forged premium container/i.test(item.name)) return battleForgedIcon;
    if (/coal/i.test(item.name)) return coalIcon;
    if (/steel/i.test(item.name)) return steelIcon;
    return undefined;
  }

  function togglePanel(panel: typeof openPanel) {
    openPanel = openPanel === panel ? undefined : panel;
  }

  // "1x Golden Gift Container" reads better as "Golden Gift Container" next to a total
  function lootName(name: string): string {
    return name.replace(/^1x\s+/i, '');
  }

  function bySlotName(a: { name: string }, b: { name: string }) {
    return a.name.localeCompare(b.name, undefined, { numeric: true });
  }

  // Drop names carry a "(Slot N)" suffix to stay unique; the slot is shown separately
  function dropName(drop: ItemDrop): string {
    return drop.name.replace(/\s*\(Slot \d+\)$/, '');
  }

  function sortedItems(drop: ItemDrop): Item[] {
    return [...drop.items].sort(
      (a, b) => (b.ship?.tier ?? 0) - (a.ship?.tier ?? 0) || a.name.localeCompare(b.name)
    );
  }
</script>

{#snippet giftGlyph(cls: string)}
  <svg aria-hidden="true" viewBox="0 0 64 64" class={cls}>
    <path
      d="M10 26h44v30H10zM6 18h52v8H6zM32 18v38M32 18c-4-10-16-12-16-4 0 4 8 4 16 4Zm0 0c4-10 16-12 16-4 0 4-8 4-16 4Z"
      fill="none"
      stroke="currentColor"
      stroke-linejoin="round"
      stroke-width="3"
    />
  </svg>
{/snippet}

{#snippet lootList(entries: LootEntry[])}
  <ul class="grid grid-cols-1 gap-1 sm:grid-cols-2">
    {#each entries as entry (entry.name)}
      {@const rarity = rarityStyles[entry.rarity]}
      <li
        class="flex items-center gap-2 bg-slate-950/40 py-1.5 pl-1.5 pr-2 text-sm normal-case"
        title={`${entry.times}× dropped`}
      >
        <span class="h-6 w-1 shrink-0 {rarity.bar}" aria-hidden="true"></span>
        <span class="min-w-0 flex-1 truncate text-white">
          {#if entry.amount !== entry.times}
            <span class="font-sans font-semibold {rarity.text}">{prettyAmount(entry.amount)}</span>
          {/if}
          {lootName(entry.name)}
        </span>
        <span class="shrink-0 font-sans text-xs text-gray-400">{prettyAmount(entry.times)}×</span>
      </li>
    {/each}
  </ul>
{/snippet}

{#snippet rateRow(drop: ItemDrop, probability: number, items: Item[], maxProbability: number)}
  {@const rarity = rarityStyles[dropRarity(drop)]}
  {@const isShipDrop = drop.type === 'ship' || drop.unique}
  {@const exhausted = isShipDrop && items.length === 0}
  <button
    onclick={() => showDetails(drop)}
    class="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 bg-slate-950/30 py-2 pl-2 pr-3 text-left outline outline-1 -outline-offset-1 outline-white/10 backdrop-blur transition-colors hover:bg-slate-800/60"
  >
    <span class="h-8 w-1 {rarity.bar}" aria-hidden="true"></span>
    <span class="min-w-0">
      <span class="flex items-baseline gap-2">
        <span class="truncate text-sm text-white">{dropName(drop)}</span>
        {#if exhausted}
          <span class="shrink-0 text-xs text-gray-400">all owned</span>
        {:else if isShipDrop}
          <span class="shrink-0 text-xs text-gray-400">{items.length} ships</span>
        {/if}
      </span>
      <span class="mt-1.5 block h-1 bg-white/10" aria-hidden="true">
        <span
          class="block h-full {rarity.bar} transition-all"
          style="width: {probability > 0
            ? Math.max(2, Math.sqrt(probability / maxProbability) * 100)
            : 0}%"
        ></span>
      </span>
    </span>
    <span class="text-right font-sans">
      <span class="block text-sm font-medium text-white">{percent.format(probability * 100)}%</span>
      <span class="block text-xs {stats.counts[drop.name] ? rarity.text : 'text-gray-500'}">
        {prettyAmount(stats.counts[drop.name] ?? 0)}× received
      </span>
    </span>
  </button>
{/snippet}

{#snippet rewardTitle(result: RollResult)}
  {@const reward = result.item ?? result.compensation}
  {#if reward}
    {#if reward.ship}
      <span class="text-amber-200">{tiers[reward.ship.tier - 1]}</span>
    {:else if reward.amount > 1}
      {prettyAmount(reward.amount)}
    {/if}
    {lootName(reward.name)}
  {:else}
    Compensation
  {/if}
{/snippet}

{#snippet rewardSource(result: RollResult)}
  {result.item
    ? dropName(result.drop)
    : `${dropName(result.drop)}: you already own every ship in it`}
{/snippet}

<!-- compact reveal card for containers that award one reward per slot -->
{#snippet slotCard(slotName: string, result: RollResult, index: number)}
  {@const rarity = rarityStyles[dropRarity(result.drop)]}
  {@const icon = itemIcon(result.item ?? result.compensation)}
  <div
    in:scale={{ start: 0.7, duration: 400, delay: index * 180, easing: backOut }}
    class="flex min-h-0 flex-1 items-center gap-3 px-3 py-3 text-left outline sm:gap-4 sm:px-4 outline-2 -outline-offset-2 {rarity.outline} {rarity.bg}"
  >
    <!-- smaller icon on narrow screens so the text keeps its room -->
    <div class="flex h-10 w-12 shrink-0 items-center justify-center sm:h-14 sm:w-20">
      {#if icon}
        <img
          src={icon}
          alt=""
          class="max-h-full max-w-full object-contain {result.item?.ship
            ? ''
            : 'h-9 w-9 sm:h-12 sm:w-12'}"
        />
      {:else}
        {@render giftGlyph(`h-8 w-8 sm:h-11 sm:w-11 ${rarity.text}`)}
      {/if}
    </div>
    <div class="min-w-0">
      <div class="header text-xs font-semibold uppercase tracking-widest {rarity.text}">
        {slotName} · {rarity.label}
        {#if result.guaranteed}· Guaranteed{/if}
      </div>
      <div class="mt-0.5 text-lg font-bold normal-case leading-tight text-white">
        {@render rewardTitle(result)}
      </div>
      <div class="truncate text-xs normal-case text-gray-400">{@render rewardSource(result)}</div>
    </div>
  </div>
{/snippet}

{#snippet shipCard(item: Item, owned = false)}
  <div
    class="flex flex-col overflow-hidden bg-slate-950/50 outline outline-1 -outline-offset-1 outline-white/10"
    class:opacity-40={owned}
  >
    <div class="relative flex h-16 items-center justify-center bg-slate-900/60 px-2">
      {#if item.ship?.image}
        <img
          src={item.ship.image}
          alt=""
          loading="lazy"
          decoding="async"
          class="h-full w-full object-contain"
        />
      {:else}
        {@render giftGlyph('h-8 w-8 text-slate-500')}
      {/if}
      {#if item.ship}
        <span
          class="header absolute left-1 top-1 bg-slate-950/80 px-1.5 text-xs font-semibold text-amber-200"
        >
          {tiers[item.ship.tier - 1]}
        </span>
      {/if}
      {#if owned}
        <span
          class="header absolute right-1 top-1 bg-slate-950/80 px-1.5 text-[0.65rem] uppercase text-gray-300"
        >
          In port
        </span>
      {/if}
    </div>
    <div class="truncate px-2 py-1.5 text-xs text-white" title={item.name}>{item.name}</div>
  </div>
{/snippet}

{#snippet bonusDrop()}
  {#if bonusShown && bonus?.kind === 'potato'}
    <BonusDrop
      icon={flamuuPotato}
      label={`Mythic · ${potatoChance * 100}%`}
      title="1 Angry Captain Potato"
      subtitle="i am poteto. (this is not a real reward, just an easter egg)"
    />
  {:else if bonusShown && bonus?.kind === 'whale'}
    <BonusDrop
      icon={santaWhale}
      label={`${prettyAmount(WHALE_OPENED)} opened`}
      title="1 Whale (it's you)"
      subtitle={`You opened over ${prettyAmount(WHALE_OPENED)} containers this session`}
    />
  {:else if bonusShown && bonus?.kind === 'golden-whale'}
    <BonusDrop
      icon={santaWhale}
      iconClass="golden"
      label={`${prettyAmount(GOLDEN_WHALE_OPENED)} opened`}
      title="1 Golden Whale (still you)"
      subtitle={`You opened over ${prettyAmount(GOLDEN_WHALE_OPENED)} containers this session`}
    />
  {:else if bonusShown}
    <CoffeeDrop chance={COFFEE_CHANCE} />
  {/if}
{/snippet}

<div class="flex flex-col gap-6">
  <!-- Container picker -->
  <div
    class="grid grid-cols-2 gap-2 sm:grid-cols-3 {containers.length >= 5
      ? 'lg:grid-cols-5'
      : 'lg:grid-cols-4'}"
    role="tablist"
    aria-label="Containers"
  >
    {#each containers as container (container.name)}
      {@const active = container === selectedContainer}
      <button
        role="tab"
        aria-selected={active}
        disabled={phase === 'opening' && !active}
        onclick={() => selectContainer(container)}
        class="header flex items-center gap-3 px-3 py-2 text-left text-sm backdrop-blur transition-all outline outline-2 -outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50
          {active
          ? 'bg-cyan-300/20 text-white outline-cyan-200/60'
          : 'bg-slate-300/10 text-gray-300 outline-slate-200/30 hover:bg-slate-600/50'}"
      >
        <img src={container.icon} alt="" class="h-10 w-10 shrink-0 object-contain" />
        <span class="min-w-0 leading-tight">
          <span class="block">{container.name}</span>
        </span>
      </button>
    {/each}
  </div>

  <!-- Stage -->
  <Box variant="dark" padding="p-0" class="overflow-hidden">
    <div class="grid w-full lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div class="stage relative flex flex-col items-center justify-center gap-6 px-6 py-8 lg:px-8">
        <img
          src={selectedContainer.icon}
          alt={selectedContainer.name}
          class="relative h-28 w-28 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)] sm:h-36 sm:w-36"
          class:shaking={phase === 'opening'}
        />
        <div class="text-center">
          <h3 class="text-2xl font-bold text-white">{selectedContainer.name}</h3>
          {#if untilGuaranteed !== undefined}
            <div class="mt-1 text-sm normal-case text-cyan-200/80">
              Guaranteed ship in <span class="font-sans font-semibold text-white"
                >{untilGuaranteed}</span
              >
              opening{untilGuaranteed === 1 ? '' : 's'}
            </div>
          {:else if selectedContainer.guaranteedDropAfter}
            <div class="mt-1 text-sm normal-case text-cyan-200/80">No ships left to guarantee</div>
          {/if}
        </div>

        <div class="flex w-full max-w-xs flex-col gap-3">
          <button
            class="header bg-emerald-300/20 px-6 py-3 text-xl font-medium uppercase tracking-wider text-white outline outline-2 -outline-offset-2 outline-emerald-200/60 backdrop-blur transition-all hover:bg-emerald-600/60 disabled:bg-emerald-800/40 disabled:text-emerald-300"
            disabled={phase === 'opening'}
            onclick={openOne}
          >
            {phase === 'opening' ? 'Opening…' : 'Open container'}
          </button>
          <div class="flex gap-2">
            <label class="sr-only" for="bulk-amount">Containers to open at once</label>
            <input
              id="bulk-amount"
              type="number"
              min="1"
              max={MAX_BULK}
              bind:value={bulkAmount}
              class="w-24 min-w-0 border border-slate-500/40 bg-slate-700/50 px-2 py-2 text-center font-sans text-sm text-white focus:border-cyan-400/60 focus:outline-none"
            />
            <button
              class="header flex-1 bg-slate-300/20 px-3 py-2 text-sm uppercase tracking-wider text-white outline outline-2 -outline-offset-2 outline-slate-200/50 transition-all hover:bg-slate-600/60 disabled:opacity-50"
              disabled={phase === 'opening'}
              onclick={openMany}
            >
              Open {prettyAmount(Math.max(1, Math.trunc(bulkAmount) || 1))} instantly
            </button>
          </div>
          <label class="flex cursor-pointer items-center gap-2 text-sm normal-case text-gray-300">
            <input
              type="checkbox"
              bind:checked={skipAnimation}
              class="h-4 w-4 accent-emerald-400"
            />
            Skip opening animation
          </label>
        </div>
      </div>

      <!-- Reveal -->
      <!-- fixed height (the stage column's height on desktop) so results scroll instead of resizing the simulator -->
      <div
        class="relative h-[28rem] border-t border-white/10 lg:h-auto lg:border-l lg:border-t-0"
        aria-live="polite"
        bind:this={revealPanel}
      >
        <div class="absolute inset-0 flex flex-col gap-4 p-6 lg:p-8">
          <div class="header text-sm font-semibold uppercase tracking-widest text-cyan-300">
            {lastBatch ? `Opened ${prettyAmount(lastBatch.opened)} containers` : 'Your drop'}
          </div>

          <div
            class="reveal-scroll -mr-2 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-2"
            bind:this={revealScroll}
          >
            {#if phase === 'opening'}
              <div class="flex flex-1 items-center justify-center text-gray-400">
                <span class="header animate-pulse uppercase tracking-widest">Unwrapping…</span>
              </div>
            {:else if lastBatch}
              {@render bonusDrop()}
              {#key revealKey}
                <div in:scale={{ start: 0.9, duration: 250 }} class="flex flex-col gap-4">
                  {#if lastBatch.ships.length}
                    <div class="flex flex-col gap-2">
                      <div class="header text-xs uppercase tracking-wide text-gray-400">
                        Ships · {prettyAmount(lastBatch.ships.length)}
                      </div>
                      <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {#each lastBatch.ships as ship}
                          {@render shipCard(ship)}
                        {/each}
                      </div>
                    </div>
                  {:else if !lastBatch.shipsAvailable}
                    <p class="text-sm normal-case text-gray-300">
                      {lastBatch.conditionalActive
                        ? 'You already own every regular ship in this container, so its drop chance went to the rarer rewards instead.'
                        : 'You already own every ship this container can drop, so ship rolls give the compensation listed below instead.'}
                    </p>
                  {:else}
                    <p class="text-sm normal-case text-gray-300">
                      No ships in {prettyAmount(lastBatch.opened)} opening{lastBatch.opened === 1
                        ? ''
                        : 's'}. On average you would get {lastBatch.expectedShips < 1
                        ? 'less than one'
                        : `about ${percent.format(Math.round(lastBatch.expectedShips * 10) / 10)}`}.
                    </p>
                  {/if}
                  {#if lastBatch.loot.length}
                    <div class="flex flex-col gap-2">
                      <div class="header text-xs uppercase tracking-wide text-gray-400">
                        Other rewards
                      </div>
                      {@render lootList(lastBatch.loot)}
                    </div>
                  {/if}
                </div>
              {/key}
            {:else if lastResult && multiSlot}
              {#key revealKey}
                <div class="flex flex-1 flex-col {bonusShown ? 'gap-2' : 'gap-3'}">
                  {#each slotResults as { name, result }, index (name)}
                    {@render slotCard(name, result, index)}
                  {/each}
                  {@render bonusDrop()}
                </div>
              {/key}
            {:else if lastResult}
              {@const rarity = rarityStyles[dropRarity(lastResult.drop)]}
              {@const reward = lastResult.item ?? lastResult.compensation}
              {@const icon = itemIcon(reward)}
              {#key revealKey}
                <div
                  in:scale={{ start: 0.6, duration: 450, easing: backOut }}
                  class="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center outline outline-2 -outline-offset-2 {rarity.outline} {rarity.bg} {rarity.glow}"
                >
                  <div
                    class="flex w-full items-center justify-center {bonusShown ? 'h-16' : 'h-28'}"
                  >
                    {#if icon}
                      <img
                        src={icon}
                        alt=""
                        class="max-h-full max-w-full object-contain {lastResult.item?.ship
                          ? ''
                          : bonusShown
                            ? 'h-14 w-14'
                            : 'h-20 w-20'}"
                      />
                    {:else}
                      {@render giftGlyph(
                        `${bonusShown ? 'h-14 w-14' : 'h-20 w-20'} ${rarity.text}`
                      )}
                    {/if}
                  </div>
                  <div>
                    <div
                      class="header text-xs font-semibold uppercase tracking-widest {rarity.text}"
                    >
                      {rarity.label}
                      {#if lastResult.guaranteed}· Guaranteed{/if}
                    </div>
                    <div class="mt-1 text-2xl font-bold normal-case text-white">
                      {@render rewardTitle(lastResult)}
                    </div>
                    <div class="mt-1 text-sm normal-case text-gray-400">
                      {@render rewardSource(lastResult)}
                    </div>
                  </div>
                </div>
              {/key}
              {@render bonusDrop()}
            {:else}
              <div
                class="flex flex-1 flex-col items-center justify-center gap-3 border border-dashed border-white/15 p-6 text-center"
              >
                {@render giftGlyph('h-14 w-14 text-cyan-200/40')}
                <p class="text-sm normal-case text-gray-400">
                  Open a container to see what Santa brings. Ships already in your port are
                  excluded.
                </p>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </Box>

  <!-- Session stats -->
  <Box uppercase variant="dark" class="border border-slate-500/30 backdrop-blur-md">
    <div class="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div class="grid grid-cols-2 gap-4 text-left sm:grid-cols-4">
        <div>
          <div class="header text-xs tracking-wide text-gray-400">Opened</div>
          <div class="font-sans text-xl font-bold text-white">{prettyAmount(stats.opened)}</div>
        </div>
        <div>
          <div class="header text-xs tracking-wide text-gray-400">Ships received</div>
          <div class="font-sans text-xl font-bold text-emerald-400">
            {prettyAmount(stats.ships.length)}
          </div>
        </div>
        <div>
          <div class="header text-xs tracking-wide text-gray-400">Ship rate</div>
          <div class="font-sans text-xl font-bold text-white">
            {stats.opened ? `${percent.format((stats.ships.length / stats.opened) * 100)}%` : '—'}
          </div>
        </div>
        <div>
          <div class="header text-xs tracking-wide text-gray-400">Pity counter</div>
          <div class="font-sans text-xl font-bold text-white">
            {#if untilGuaranteed !== undefined}
              {stats.pity}<span class="text-sm text-gray-400"
                >/{selectedContainer.guaranteedDropAfter}</span
              >
            {:else}
              —
            {/if}
          </div>
        </div>
      </div>
      <button
        class="header border border-white/20 bg-white/10 px-4 py-2 text-xs tracking-wider text-gray-200 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
        disabled={stats.opened === 0 || phase === 'opening'}
        onclick={reset}
      >
        Reset session
      </button>
    </div>
  </Box>

  <!-- Details, collapsed by default to keep the simulator compact -->
  <div class="flex flex-col gap-3">
    <div class="grid grid-cols-3 gap-2">
      {#each [{ id: 'rates', label: 'Drop rates', count: undefined }, { id: 'loot', label: 'Rewards', count: stats.loot.length || undefined }, { id: 'ships', label: 'Ships received', count: stats.ships.length || undefined }] as const as tab (tab.id)}
        {@const active = openPanel === tab.id}
        <button
          aria-expanded={active}
          aria-controls="simulator-details"
          onclick={() => togglePanel(tab.id)}
          class="header flex items-center justify-center gap-2 px-2 py-2 text-sm uppercase tracking-wider backdrop-blur transition-all outline outline-2 -outline-offset-2
            {active
            ? 'bg-cyan-300/20 text-white outline-cyan-200/60'
            : 'bg-slate-300/10 text-gray-300 outline-slate-200/30 hover:bg-slate-600/50'}"
        >
          <span class="truncate">{tab.label}</span>
          {#if tab.count}
            <span class="bg-white/15 px-1.5 font-sans text-xs text-white"
              >{prettyAmount(tab.count)}</span
            >
          {/if}
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            class="hidden h-4 w-4 shrink-0 transition-transform sm:block"
            class:rotate-180={active}
            fill="currentColor"
          >
            <path
              d="M5.2 7.2a.75.75 0 0 1 1.06 0L10 10.94l3.74-3.74a.75.75 0 1 1 1.06 1.06l-4.27 4.27a.75.75 0 0 1-1.06 0L5.2 8.26a.75.75 0 0 1 0-1.06Z"
            />
          </svg>
        </button>
      {/each}
    </div>

    {#if openPanel}
      <div id="simulator-details" transition:slide={{ duration: 200 }}>
        {#if openPanel === 'rates'}
          {#if multiSlot}
            <p class="mb-3 text-sm normal-case text-cyan-100/80">
              Every opening gives one reward from each of the {rateSlots.length} slots below. Each slot
              rolls on its own.
            </p>
          {/if}
          <div class="flex flex-col gap-4">
            {#each rateSlots as slot (slot.name)}
              <section class="flex flex-col gap-2">
                {#if multiSlot}
                  <h4
                    class="header flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-cyan-300"
                  >
                    {slot.name}
                    <span class="h-px flex-1 bg-cyan-200/20" aria-hidden="true"></span>
                  </h4>
                {/if}
                <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {#each slot.drops as { drop, probability, items } (drop.name)}
                    {@render rateRow(drop, probability, items, slot.maxProbability)}
                  {/each}
                </div>
              </section>
            {/each}
          </div>
          <p class="mt-2 text-xs normal-case text-gray-400">
            Select a drop to see every possible reward. Ships you receive are removed from later
            rolls automatically.
          </p>
        {:else if openPanel === 'loot'}
          {#if stats.loot.length}
            {@render lootList(stats.loot)}
          {:else}
            <div
              class="border border-dashed border-white/15 p-4 text-center text-sm normal-case text-gray-400"
            >
              Open some containers to see your rewards add up.
            </div>
          {/if}
        {:else if stats.ships.length}
          <div class="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {#each showAllShips ? stats.ships : stats.ships.slice(0, 12) as ship}
              {@render shipCard(ship)}
            {/each}
          </div>
          {#if stats.ships.length > 12}
            <button
              class="header mt-2 w-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-wider text-gray-200 transition-colors hover:bg-white/20"
              onclick={() => (showAllShips = !showAllShips)}
            >
              {showAllShips ? 'Show fewer' : `Show all ${prettyAmount(stats.ships.length)} ships`}
            </button>
          {/if}
        {:else}
          <div
            class="border border-dashed border-white/15 p-4 text-center text-sm normal-case text-gray-400"
          >
            No ships received yet this session.
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<Modal bind:open={detailsOpen}>
  {#if detailsDrop}
    <h2 class="header mb-2 text-2xl font-bold">{dropName(detailsDrop)}</h2>
    {#if detailsDrop.condition}
      <p class="mb-4 text-cyan-300">{detailsDrop.condition}</p>
    {/if}
    {#if detailsDrop.items.length > 1}
      <p class="mb-3 text-sm normal-case text-gray-300">
        {#if detailsDrop.type === 'ship' || detailsDrop.unique}
          You receive <strong class="text-white">one</strong> of these ships. Ships you already own are
          skipped.
        {:else}
          You receive <strong class="text-white">one</strong> of these.
        {/if}
      </p>
    {/if}
    {#if detailsDrop.items.some((item) => item.ship)}
      <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {#each sortedItems(detailsDrop) as item}
          {@render shipCard(item, isOwned(item, sim.owned))}
        {/each}
      </div>
    {:else}
      <ul class="list-inside list-disc space-y-1">
        {#each detailsDrop.items as item}
          <li>
            {#if item.amount > 1}<span class="text-emerald-400">{prettyAmount(item.amount)}×</span
              >{/if}
            {item.name}
          </li>
        {/each}
      </ul>
    {/if}
  {/if}
</Modal>

<style>
  .reveal-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgb(255 255 255 / 0.2) transparent;
  }

  .stage::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 35%, rgba(103, 232, 249, 0.18), transparent 60%);
    pointer-events: none;
  }

  .shaking {
    animation: shake 0.9s ease-in-out;
  }

  @keyframes shake {
    0%,
    100% {
      transform: rotate(0) scale(1);
    }
    15% {
      transform: rotate(-8deg) scale(1.04);
    }
    30% {
      transform: rotate(8deg) scale(1.08);
    }
    45% {
      transform: rotate(-10deg) scale(1.12);
    }
    60% {
      transform: rotate(10deg) scale(1.16);
    }
    80% {
      transform: rotate(0) scale(1.3);
      filter: brightness(1.8);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .shaking {
      animation: none;
    }
  }

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
