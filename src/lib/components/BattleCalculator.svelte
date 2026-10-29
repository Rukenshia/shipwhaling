<script lang="ts">
  import type { Reward } from '$lib/reward';
  import type { BattleCalculatorEvent } from '$lib/rewardCalculator';
  import type { Ship } from '$lib/ship';
  import { slide } from 'svelte/transition';
  import { prettyAmount } from '$lib/util';
  import Box from './Box.svelte';

  let { activeEvent, shipsInPort } = $props<{
    activeEvent: BattleCalculatorEvent;
    shipsInPort: Ship[];
  }>();

  let averageBaseXP = $state(800);
  let calculatedBattles = $state(0);
  let showRules = $state(false);

  const minBaseXP = 100;
  const maxBaseXP = 3200;
  let sliderFill = $derived(((averageBaseXP - minBaseXP) / (maxBaseXP - minBaseXP)) * 100);
  let additionalRewards = $derived(activeEvent.getMaxAdditionalRewards(shipsInPort.length));

  $effect(() => {
    if (activeEvent && shipsInPort.length > 0) {
      calculateBattles();
    }
  });

  function calculateBattles() {
    if (averageBaseXP <= 0 || shipsInPort.length === 0) {
      calculatedBattles = 0;
      return;
    }

    const allRewards = shipsInPort
      .map((ship: Ship) => {
        return activeEvent.calculateShipReward(ship);
      })
      .filter((r: Reward | undefined) => r !== undefined);

    const baseXpForAdditionalRewards = activeEvent.getAdditionalRewardXPRequirement();
    const totalUnlocks = allRewards.length;

    let unlocks = 0;
    let baseXpEarnedSinceAdditionalRewards = 0;
    let baseXpEarnedOnShip = 0;
    let currentReward = allRewards[unlocks];
    let pendingAdditionalRewards = 0;
    let battles = 0;

    while (unlocks < totalUnlocks) {
      // take any free additional rewards, but only if we are not currently on a ship reward
      if (baseXpEarnedOnShip === 0 && pendingAdditionalRewards > 0) {
        pendingAdditionalRewards--;

        unlocks++;

        if (unlocks >= totalUnlocks) {
          break;
        }
        currentReward = allRewards[unlocks];
        continue;
      }

      battles++;
      baseXpEarnedOnShip += averageBaseXP;
      baseXpEarnedSinceAdditionalRewards += averageBaseXP;

      // add additional rewards if we reached the threshold
      if (baseXpEarnedSinceAdditionalRewards >= baseXpForAdditionalRewards) {
        pendingAdditionalRewards +=
          Math.floor(baseXpEarnedSinceAdditionalRewards / baseXpForAdditionalRewards) *
          activeEvent.getMaxAdditionalRewards(shipsInPort.length);
        baseXpEarnedSinceAdditionalRewards %= baseXpForAdditionalRewards;
      }

      if (baseXpEarnedOnShip >= currentReward.requiredXP) {
        unlocks++;
        currentReward = allRewards[unlocks];
        baseXpEarnedOnShip = 0;

        continue;
      }
    }

    calculatedBattles = battles;
  }

  function formatTier(tier: number): string {
    const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', '⭐︎'];
    return romans[tier - 1] || `T${tier}`;
  }
</script>

<Box variant="dark" padding="p-0" class="overflow-hidden">
  <div class="grid w-full lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
    <!-- Average Base XP Slider -->
    <div class="flex flex-col justify-center gap-4 px-6 py-6 lg:px-8">
      <div class="flex items-baseline justify-between gap-4">
        <label
          for="baseXP"
          class="header text-sm font-semibold uppercase tracking-widest text-cyan-300"
        >
          Average Base XP per battle
        </label>
        <span class="font-sans text-3xl font-bold text-white">{prettyAmount(averageBaseXP)}</span>
      </div>
      <input
        id="baseXP"
        type="range"
        min={minBaseXP}
        max={maxBaseXP}
        step="100"
        bind:value={averageBaseXP}
        oninput={calculateBattles}
        style="--fill: {sliderFill}%"
        class="slider h-2 w-full cursor-pointer appearance-none"
      />
      <div class="flex justify-between font-sans text-xs text-gray-400">
        <span>{prettyAmount(minBaseXP)}</span>
        <span>{prettyAmount((minBaseXP + maxBaseXP) / 2)}</span>
        <span>{prettyAmount(maxBaseXP)}</span>
      </div>
    </div>

    <!-- Results -->
    <div
      class="grid grid-cols-2 gap-3 border-t border-white/10 p-6 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:p-8"
    >
      <div class="bg-slate-950/40 p-3">
        <div class="header text-xs uppercase tracking-wide text-gray-400">Battles needed</div>
        <div class="font-sans text-3xl font-bold text-emerald-400">
          {prettyAmount(calculatedBattles)}
        </div>
        <div class="text-xs text-gray-400">to get all ship rewards</div>
      </div>
      <div class="bg-slate-950/40 p-3">
        <div class="header text-xs uppercase tracking-wide text-gray-400">Additional rewards</div>
        <div class="font-sans text-3xl font-bold text-white">{additionalRewards}</div>
        <div class="text-xs text-gray-400">
          for every {prettyAmount(activeEvent.getAdditionalRewardXPRequirement())} Base XP
        </div>
      </div>
    </div>
  </div>

  <!-- Rules -->
  <div class="w-full border-t border-white/10">
    <button
      aria-expanded={showRules}
      aria-controls="battle-calculator-rules"
      onclick={() => (showRules = !showRules)}
      class="header flex w-full items-center justify-between px-6 py-3 text-sm uppercase tracking-wider text-gray-300 transition-colors hover:bg-white/5 hover:text-white lg:px-8"
    >
      How Festive Rewards work
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        class="h-4 w-4 shrink-0 transition-transform"
        class:rotate-180={showRules}
        fill="currentColor"
      >
        <path
          d="M5.2 7.2a.75.75 0 0 1 1.06 0L10 10.94l3.74-3.74a.75.75 0 1 1 1.06 1.06l-4.27 4.27a.75.75 0 0 1-1.06 0L5.2 8.26a.75.75 0 0 1 0-1.06Z"
        />
      </svg>
    </button>

    {#if showRules}
      <div
        id="battle-calculator-rules"
        transition:slide={{ duration: 200 }}
        class="grid gap-3 px-6 pb-6 md:grid-cols-2 lg:px-8"
      >
        <div class="flex flex-col gap-3 bg-slate-950/40 p-4">
          <div class="flex items-baseline justify-between gap-2">
            <span class="header font-semibold uppercase tracking-wide text-white">
              Ship rewards
            </span>
            <span class="text-xs text-gray-400">once per ship</span>
          </div>
          <p class="text-sm text-gray-300">
            Earn enough Base XP across any number of battles on a ship to get its reward.
          </p>
          <ul class="grid grid-cols-2 gap-1 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
            {#each [5, 6, 7, 8, 9, 10, 11] as tier}
              <li class="flex items-center justify-between gap-2 bg-slate-900/60 px-2 py-1 text-xs">
                <span class="header font-semibold text-amber-200">{formatTier(tier)}</span>
                <span class="font-sans text-white"
                  >{prettyAmount(activeEvent.getBaseXPRequirement(tier))}</span
                >
              </li>
            {/each}
          </ul>
        </div>

        <div class="flex flex-col gap-3 bg-slate-950/40 p-4">
          <div class="flex items-baseline justify-between gap-2">
            <span class="header font-semibold uppercase tracking-wide text-white">
              Additional rewards
            </span>
            <span class="text-xs text-gray-400"
              >every {prettyAmount(activeEvent.getAdditionalRewardXPRequirement())} Base XP</span
            >
          </div>
          <p class="text-sm text-gray-300">
            Earn {prettyAmount(activeEvent.getAdditionalRewardXPRequirement())} Base XP over any number
            of battles to unlock
            <span class="font-semibold text-white">{additionalRewards}</span>
            additional reward{additionalRewards === 1 ? '' : 's'}, based on your port with
            <span class="font-semibold text-white">{shipsInPort.length}</span> ships.
          </p>
        </div>
      </div>
    {/if}
  </div>
</Box>

<style>
  .slider {
    background: linear-gradient(
      to right,
      rgb(52 211 153) 0%,
      rgb(52 211 153) var(--fill),
      rgb(255 255 255 / 0.1) var(--fill),
      rgb(255 255 255 / 0.1) 100%
    );
  }

  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 18px;
    width: 18px;
    background: #fff;
    cursor: pointer;
    border: 3px solid rgb(16 185 129);
  }

  .slider::-moz-range-thumb {
    height: 12px;
    width: 12px;
    border-radius: 0;
    background: #fff;
    cursor: pointer;
    border: 3px solid rgb(16 185 129);
  }

  .slider:focus {
    outline: none;
  }

  .slider:focus-visible::-webkit-slider-thumb {
    box-shadow: 0 0 0 3px rgb(52 211 153 / 0.4);
  }

  .slider:focus-visible::-moz-range-thumb {
    box-shadow: 0 0 0 3px rgb(52 211 153 / 0.4);
  }
</style>
