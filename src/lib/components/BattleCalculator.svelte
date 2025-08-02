<script lang="ts">
  import type { Reward } from '$lib/reward';
  import type { Anniversary2025 } from '$lib/rewards/anniversary2025';
  import type { Ship } from '$lib/ship';
  import Collapsible from '$lib/components/Collapsible.svelte';
  import Box from './Box.svelte';

  let { activeEvent, shipsInPort } = $props<{
    activeEvent: Anniversary2025;
    shipsInPort: Ship[];
  }>();

  let averageBaseXP = $state(800);
  let calculatedBattles = $state(0);
  let additionalRewards = $state(0);

  $effect(() => {
    if (activeEvent && shipsInPort.length > 0) {
      additionalRewards = activeEvent.getMaxAdditionalRewards(shipsInPort.length);
      calculateBattles();
    }
  });

  function calculateBattles() {
    if (averageBaseXP <= 0 || shipsInPort <= 0) {
      calculatedBattles = 0;
      return;
    }

    const allRewards = shipsInPort
      .map((ship: Ship) => {
        return activeEvent.calculateShipReward(ship);
      })
      .filter((r: Reward | undefined) => r !== undefined);

    const baseXpForAdditionalRewards = activeEvent.getAdditionalRewardXPRequirement(shipsInPort);
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

<Box variant="dark" class="backdrop-blur transition-all pb-8">
  <div class="space-y-6 w-full">
    <!-- Average Base XP Slider -->
    <div class="">
      <label for="baseXP" class="block text-lg font-semibold text-cyan-50">
        Average Base XP per battle: <span class="text-cyan-200">{averageBaseXP}</span>
      </label>
      <input
        id="baseXP"
        type="range"
        min="100"
        max="3200"
        step="100"
        bind:value={averageBaseXP}
        oninput={calculateBattles}
        class="w-full h-3 bg-cyan-200/20 rounded-lg appearance-none cursor-pointer slider"
      />
      <div class="flex justify-between text-center text-sm text-cyan-300">
        <span>100</span>
        <span class="-ml-4">1,600</span>
        <span>3,200</span>
      </div>
    </div>

    <!-- Results -->
    <div class="grid gap-4 sm:grid-cols-2">
      <Box variant="verylight">
        <div class="flex w-full flex-col">
          <div class="text-sm text-cyan-300 uppercase tracking-wide">Estimated Battles Needed</div>
          <div class="text-3xl font-bold text-cyan-100">{calculatedBattles}</div>
          <div class="text-xs text-cyan-300 mt-1">to get all ship rewards</div>
        </div>
      </Box>

      <Box variant="verylight">
        <div class="flex w-full flex-col">
          <div class="text-sm text-cyan-300 uppercase tracking-wide">Additional Rewards</div>
          <div class="text-3xl font-bold text-cyan-100">
            {activeEvent.getMaxAdditionalRewards(shipsInPort.length)}
          </div>
          <div class="text-xs text-cyan-300 mt-1">
            for every {activeEvent.getAdditionalRewardXPRequirement()} Base XP
          </div>
        </div>
      </Box>
    </div>

    <!-- Mission Breakdown -->
    <Collapsible title="How The Anniversary Event Works">
      {#snippet children()}
        <div class="space-y-3">
          <Box variant="dark">
            <div class="w-full">
              <div class="flex justify-between items-center mb-2">
                <span class="font-semibold text-cyan-100">Individual Ship Rewards</span>
                <span class="text-cyan-300">Once per ship</span>
              </div>
              <div class="text-sm text-cyan-300 space-y-1">
                <div>
                  Earn enough Base XP across any number of battles on a ship to get its reward:

                  <ul class="list-disc pl-6 text-xs">
                    {#each [5, 6, 7, 8, 9, 10, 11] as tier}
                      <li>
                        Tier {formatTier(tier)}: {activeEvent.getBaseXPRequirement(tier)} Base XP
                      </li>
                    {/each}
                  </ul>
                </div>
              </div>
            </div>
          </Box>

          <Box variant="dark">
            <div class="w-full">
              <div class="flex justify-between items-center mb-2">
                <span class="font-semibold text-cyan-100">Additional Rewards</span>
                <span class="text-cyan-300"
                  >Every {activeEvent.getAdditionalRewardXPRequirement()} Base XP</span
                >
              </div>
              <div class="text-sm text-cyan-300 space-y-1">
                <div>
                  Earn {activeEvent.getAdditionalRewardXPRequirement(shipsInPort)} Base XP over any number
                  of battles to get {activeEvent.getMaxAdditionalRewards(shipsInPort.length)} additional
                  unlocks (based on your port with {shipsInPort.length} ships)
                </div>
              </div>
            </div>
          </Box>
        </div>
      {/snippet}
    </Collapsible>
  </div>
</Box>

<style>
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #67e8f9;
    cursor: pointer;
    border: 2px solid #0e7490;
  }

  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #67e8f9;
    cursor: pointer;
    border: 2px solid #0e7490;
  }

  .slider:focus {
    outline: none;
  }

  .slider:focus::-webkit-slider-thumb {
    box-shadow: 0 0 0 3px rgba(103, 232, 249, 0.3);
  }
</style>
