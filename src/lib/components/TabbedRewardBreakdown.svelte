<script lang="ts">
  import type { Reward } from '$lib/reward';
  import type { Ship } from '$lib/ship';
  import RewardBreakdown from './RewardBreakdown.svelte';

  type RewardWithShip = Reward & { ship: Ship };

  let {
    currentRewards,
    previouslyOwnedRewards,
    excludedPreviouslyOwnedShipIds,
    onPreviouslyOwnedShipInclusionChange
  }: {
    currentRewards: RewardWithShip[];
    previouslyOwnedRewards: RewardWithShip[];
    excludedPreviouslyOwnedShipIds: ReadonlySet<number>;
    onPreviouslyOwnedShipInclusionChange: (shipId: number, included: boolean) => void;
  } = $props();

  let activeTab = $state('current');
  let search = $state('');

  // ignore case and diacritics so "smaland" finds "Småland"
  function normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .trim();
  }

  function filterRewards(rewards: RewardWithShip[], query: string): RewardWithShip[] {
    const normalizedQuery = normalize(query);

    if (!normalizedQuery) {
      return rewards;
    }

    return rewards.filter((reward) => normalize(reward.ship.name).includes(normalizedQuery));
  }

  let filteredCurrentRewards = $derived(filterRewards(currentRewards, search));
  let filteredPreviouslyOwnedRewards = $derived(filterRewards(previouslyOwnedRewards, search));
  let emptyMessage = $derived(search.trim() ? `No ships match "${search.trim()}".` : undefined);

  function setActiveTab(tab: string) {
    activeTab = tab;
  }
</script>

<div class="flex flex-col gap-3">
  <div class="grid grid-cols-2 gap-2" role="tablist" aria-label="Breakdown">
    {#each [{ id: 'current', label: 'Ships in Port', count: filteredCurrentRewards.length }, { id: 'previously-owned', label: 'Previously Owned', count: filteredPreviouslyOwnedRewards.length }] as tab (tab.id)}
      {@const active = activeTab === tab.id}
      <button
        role="tab"
        aria-selected={active}
        onclick={() => setActiveTab(tab.id)}
        class="header flex items-center justify-center gap-2 px-2 py-2 text-sm uppercase tracking-wider backdrop-blur transition-all outline outline-2 -outline-offset-2
          {active
          ? 'bg-cyan-300/20 text-white outline-cyan-200/60'
          : 'bg-slate-300/10 text-gray-300 outline-slate-200/30 hover:bg-slate-600/50'}"
      >
        <span class="truncate">{tab.label}</span>
        <span class="bg-white/15 px-1.5 font-sans text-xs text-white">{tab.count}</span>
      </button>
    {/each}
  </div>

  <div class="relative">
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="currentColor"
      class="pointer-events-none absolute left-3 z-10 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
    >
      <path
        fill-rule="evenodd"
        d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.45 4.39l3.08 3.08a.75.75 0 1 1-1.06 1.06l-3.08-3.08A7 7 0 0 1 2 9Z"
        clip-rule="evenodd"
      />
    </svg>
    <label class="sr-only" for="breakdown-search">Search ships</label>
    <input
      id="breakdown-search"
      type="search"
      placeholder="Search ships…"
      autocomplete="off"
      bind:value={search}
      onkeydown={(event) => event.key === 'Escape' && (search = '')}
      class="w-full border border-slate-500/40 bg-slate-950/40 py-2 pl-9 pr-3 text-sm text-white placeholder-gray-400 backdrop-blur focus:border-cyan-400/60 focus:outline-none"
    />
  </div>

  {#if activeTab === 'current'}
    <RewardBreakdown rewards={filteredCurrentRewards} {emptyMessage} />
  {:else if activeTab === 'previously-owned'}
    <RewardBreakdown
      rewards={filteredPreviouslyOwnedRewards}
      {emptyMessage}
      selectable
      excludedShipIds={excludedPreviouslyOwnedShipIds}
      onShipInclusionChange={onPreviouslyOwnedShipInclusionChange}
    />
  {/if}
</div>
