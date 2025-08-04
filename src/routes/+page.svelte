<script lang="ts">
  import { Realm, login, user } from '$lib/store';
  import { onMount } from 'svelte';
  import { derived } from 'svelte/store';
  import { type Reward } from '$lib/reward';
  import RewardStat from '$lib/components/RewardStat.svelte';
  import Faq from '$lib/components/FAQ.svelte';

  import warships from '$lib/assets/warships.json';
  import Title from '$lib/components/Title.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';
  import type { Ship } from '$lib/ship';

  import bmcLogo from '$lib/assets/bmc-logo.svg';
  import { Coal, Steel, type Resource } from '$lib/resource';
  import RewardBreakdown from '$lib/components/RewardBreakdown.svelte';
  import TabbedRewardBreakdown from '$lib/components/TabbedRewardBreakdown.svelte';
  import BattleCalculator from '$lib/components/BattleCalculator.svelte';
  import { slide } from 'svelte/transition';
  import ModifierSelect from '$lib/components/ModifierSelect.svelte';
  import { CoalPort, SteelPort } from '$lib/modifiers';
  import { Anniversary2025 } from '$lib/rewards/anniversary2025';
  import Anniversary2025Shop from '$lib/components/events/Anniversary2025Shop.svelte';
  import Box from '$lib/components/Box.svelte';
  import {
    createRewardsStore,
    createEventStatsStore,
    type EventStats
  } from '$lib/rewardCalculator';
  import Tooltip from '$lib/components/Tooltip.svelte';

  const activeEvent = new Anniversary2025();

  let showSettings = $state(false);
  let coalModifier = $state(1);
  let steelModifier = $state(1);

  function saveModifiers() {
    localStorage.setItem('coalModifier', `${coalModifier}`);
    localStorage.setItem('steelModifier', `${steelModifier}`);
  }

  onMount(() => {
    // load modifiers
    coalModifier = parseFloat(localStorage.getItem('coalModifier') || '1');
    steelModifier = parseFloat(localStorage.getItem('steelModifier') || '1');

    // try to init user from local storage
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.expires_at * 1000 < Date.now()) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }

      login({
        ...parsedUser
      });
    } else {
      window.location.href = '/login';
    }

    const unsubscribe = user.subscribe(($user) => {});

    return () => {
      unsubscribe();
    };
  });

  function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('coalModifier');
    localStorage.removeItem('steelModifier');
    window.location.href = '/login';
  }

  const shipsInPort = derived(user, async ($user) => {
    if (!$user) {
      return [];
    }

    const ships = await $user.getShipsInPort();

    return ships
      .map((shipId: number) => {
        return (
          warships.data.find((ship) => ship.id === shipId) || new Error(`unknown ship ${shipId}`)
        );
      })
      .filter((shiporError: Ship | Error): shiporError is Ship => {
        if (shiporError instanceof Error) {
          console.warn(shiporError.message);
          return false;
        }

        return true;
      })
      .map((s: any) => ({ ...s, inPort: true }));
  });

  const previouslyOwnedShips = derived(user, async ($user) => {
    if (!$user) {
      return [];
    }

    const ships = await $user.getPreviouslyOwnedShipIds();

    return ships
      .map((shipId: number) => {
        return (
          warships.data.find((ship) => ship.id === shipId) || new Error(`unknown ship ${shipId}`)
        );
      })
      .filter((shiporError: Ship | Error): shiporError is Ship => {
        if (shiporError instanceof Error) {
          console.warn(shiporError.message);
          return false;
        }

        return true;
      })
      .map((s: any) => ({ ...s, inPort: false }));
  });

  function applyModifier(
    value: number,
    resource: Resource,
    coalModifier: number,
    steelModifier: number
  ) {
    switch (resource) {
      case Coal:
        return Math.floor(value * coalModifier);
      case Steel:
        return Math.floor(value * steelModifier);
      default:
        return value;
    }
  }

  const rewards = createRewardsStore(shipsInPort, activeEvent);
  const previouslyOwnedRewards = createRewardsStore(previouslyOwnedShips, activeEvent);

  const eventStats = createEventStatsStore(rewards, activeEvent);
  const previouslyOwnedEventStats = createEventStatsStore(previouslyOwnedRewards, activeEvent);

  const maxAdditionalRewards = derived(shipsInPort, async ($shipsInPort) => {
    const ships = await $shipsInPort;

    return activeEvent.getMaxAdditionalRewards(ships.length);
  });

  // Calculate available festive tokens for the shop
  const availableFestiveTokens = derived(eventStats, async ($eventStats) => {
    const stats = await $eventStats;
    return stats.rewards['Festive Tokens']?.total || 0;
  });

  const realmColors = {
    [Realm.EU]: 'text-cyan-300',
    [Realm.NA]: 'text-rose-400',
    [Realm.ASIA]: 'text-amber-300'
  };
</script>

<div class="space-y-12 max-w-4xl mx-auto">
  <div class="space-y-4">
    <div
      class="flex gap-4 md:gap-0 md:flex-row flex-col-reverse md:items-center justify-between pr-1"
    >
      <Title size="text-4xl sm:text-6xl" align="left">
        <div class="flex gap-4 items-center">
          <div>Rewards</div>
          <div>
            <a
              href="https://blog.worldofwarships.com/blog/a-decade-at-sea-closed-test-148"
              target="_blank"
              class="block bg-white/20 hover:bg-white/30 transition-colors duration-200 backdrop-blur border-white/40 border-2 px-4 py-1 sm:py-2 text-white text-base sm:text-lg"
            >
              Rules
            </a>
          </div>
        </div>

        {#snippet subtitle()}
          <div>The number of resources you can earn based on your ships in port.</div>
        {/snippet}
      </Title>
      <div
        class="flex-shrink w-full sm:w-auto sm:min-w-[16rem] bg-white/10 backdrop-blur p-2 text-white text-sm flex flex-col header items-center justify-center"
      >
        <div class="text-sm uppercase">
          Logged in as
          {#if $user}
            <span class={realmColors[$user.realm]}>{$user.username}</span>
          {:else}
            Unknown
          {/if}
        </div>
        <button
          class="mt-4 w-full h-full bg-rose-500/20 hover:bg-rose-500/40 transition-colors duration-200 px-2 py-2 border-2 border-rose-600/50 backdrop-blur text-rose-500 text-sm uppercase tracking-wider font-semibold"
          onclick={() => logout()}
        >
          <h5>Log out</h5>
        </button>
        <button
          class="mt-4 w-full h-full bg-white/20 hover:bg-white/10 transition-colors duration-200 px-2 py-2 border-2 border-white/20 backdrop-blur text-gray-200 text-sm uppercase tracking-wider font-semibold flex items-center justify-center gap-1"
          onclick={() => (showSettings = !showSettings)}
        >
          <svg
            class="h-6 w-6"
            data-slot="icon"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clip-rule="evenodd"
              fill-rule="evenodd"
              d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
            ></path>
          </svg>
          <div>clan bonus</div>
        </button>

        {#if showSettings}
          <div transition:slide class="mt-4 w-full flex flex-col gap-2 items-start">
            <div class="text-gray-200 uppercase text-sm font-medium tracking-wider w-full">
              CLAN BONUS
            </div>
            <ModifierSelect
              building={CoalPort}
              onSelect={(modifier) => {
                coalModifier = modifier;
                saveModifiers();
              }}
              selected={coalModifier}
            />
            <ModifierSelect
              building={SteelPort}
              onSelect={(modifier) => {
                steelModifier = modifier;
                saveModifiers();
              }}
              selected={steelModifier}
            />
          </div>
        {/if}
      </div>
    </div>
    <div class="space-y-8">
      <!-- Main rewards section -->
      <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {#await Promise.all([$eventStats, $previouslyOwnedEventStats])}
          {#each activeEvent.possibleResources as resource}
            <RewardStat title={resource.name} icon={resource.image} value={0} />
          {/each}
        {:then [currentRewards, previousRewards]}
          {#each activeEvent.possibleResources as resource}
            <RewardStat
              title={resource.name}
              icon={resource.image}
              value={applyModifier(
                currentRewards.rewards[resource.name].total,
                resource,
                coalModifier,
                steelModifier
              )}
            >
              from {currentRewards.rewards[resource.name].ships} ships in port
            </RewardStat>
          {/each}
          {#each Object.keys(currentRewards.conversions) as conversionStat}
            <RewardStat
              title={currentRewards.conversions[conversionStat].container.name}
              icon={currentRewards.conversions[conversionStat].container.icon}
              value={currentRewards.conversions[conversionStat].total}
            >
              by converting all {currentRewards.conversions[conversionStat].source.name}
            </RewardStat>
          {/each}
          <!-- {#await $maxAdditionalRewards}
            <RewardStat title="Additional Rewards" value={0} />
          {:then maxAdditionalRewards}
            <RewardStat title="Additional Rewards" value={maxAdditionalRewards}>
              Per battle over 1,000 Base XP
            </RewardStat>
          {:catch}
            <RewardStat title="Additional Rewards" value={0} />
          {/await} -->
        {:catch error}
          <ErrorMessage>{error.message}</ErrorMessage>
        {/await}

        <!-- Previously owned ships rewards -->
        <div>
          <Tooltip>
            {#snippet tooltip()}
              You could earn these rewards if you re-buy ships that you had in your port before. A
              full breakdown can be found in the "Breakdown" section below.
            {/snippet}
            <div class="grid grid-cols-2 md:grid-cols-1 gap-3">
              {#await Promise.all([$eventStats, $previouslyOwnedEventStats])}
                {#each activeEvent.possibleResources as resource}
                  <RewardStat
                    title={resource.name}
                    icon={resource.image}
                    value={0}
                    variant="compact"
                  />
                {/each}
              {:then [currentRewards, previousRewards]}
                {#each activeEvent.possibleResources as resource}
                  <RewardStat
                    title={resource.name}
                    icon={resource.image}
                    value={applyModifier(
                      previousRewards.rewards[resource.name].total,
                      resource,
                      coalModifier,
                      steelModifier
                    )}
                    variant="compact"
                  >
                    from {previousRewards.rewards[resource.name].ships} previously owned ships
                  </RewardStat>
                {/each}
                {#each Object.keys(previousRewards.conversions) as conversionStat}
                  <RewardStat
                    title={previousRewards.conversions[conversionStat].container.name}
                    icon={previousRewards.conversions[conversionStat].container.icon}
                    value={previousRewards.conversions[conversionStat].total}
                    variant="compact"
                  >
                    by converting {previousRewards.conversions[conversionStat].source.name}
                  </RewardStat>
                {/each}
              {:catch error}
                <ErrorMessage>{error.message}</ErrorMessage>
              {/await}
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  </div>

  <div>
    <Title size="text-4xl sm:text-6xl" align="left">
      Battle Calculator

      {#snippet subtitle()}
        <div>
          Calculate how many battles you need to complete all missions based on your average Base
          XP.
        </div>
      {/snippet}
    </Title>
    {#await $shipsInPort}
      Loading
    {:then shipsInPort}
      <BattleCalculator {activeEvent} {shipsInPort} />
    {:catch error}
      <ErrorMessage>{error.message}</ErrorMessage>
    {/await}
  </div>

  <div>
    <Title size="text-4xl sm:text-6xl" align="left">
      Gift Shopping

      {#snippet subtitle()}
        <div>Plan how to spend your festive tokens from the Anniversary 2025 event</div>
      {/snippet}
    </Title>
    {#await Promise.all([$shipsInPort, $availableFestiveTokens])}
      Loading...
    {:then [shipsInPort, festiveTokens]}
      <Anniversary2025Shop tokens={festiveTokens} />
    {:catch error}
      <ErrorMessage>{error.message}</ErrorMessage>
    {/await}
  </div>

  <div>
    <Title size="text-4xl sm:text-6xl" align="left">
      Breakdown

      {#snippet subtitle()}
        <div>
          A list of all ships that were considered for the calculations on this page. You might be
          able to buy more ships for additional rewards.
        </div>
      {/snippet}
    </Title>
    {#await Promise.all([$rewards, $previouslyOwnedRewards])}
      Loading
    {:then [rewards, previouslyOwnedRewards]}
      <TabbedRewardBreakdown currentRewards={rewards} {previouslyOwnedRewards} />
    {:catch error}
      <ErrorMessage>{error.message}</ErrorMessage>
    {/await}
  </div>

  <div class="space-y-8">
    <div>
      <Title size="text-4xl sm:text-6xl" align="left">About</Title>
      <Box variant="dark" class="pb-8">
        <div>
          <p class="leading-relaxed">
            On this website, you can plan your Event rewards. It uses the ships you currently have
            in your port to calculate available rewards.
          </p>
          <div class="space-y-4">
            <p class="leading-relaxed">
              This tool was created by <strong class="text-cyan-300">Rukenshia</strong> on the EU
              Server. If you have any questions, feedback, or just want to say hi, you can contact
              me on Discord at
              <strong class="text-cyan-300">Rukenshia</strong>
              or email me at
              <a
                href="mailto:svc-shipwhaling@ruken.pw"
                class="text-cyan-300 hover:text-cyan-100 underline transition-colors duration-200"
              >
                svc-shipwhaling@ruken.pw
              </a>.
            </p>
            <div class="flex items-center space-x-4 flex-wrap">
              <span class="text-cyan-200">If you really loved using this website, you can also</span
              >
              <a
                href="https://buymeacoffee.com/rukenshia"
                target="_blank"
                class="inline-flex items-center text-sm px-4 py-1 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-cyan-100 transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                <img src={bmcLogo} alt="Buy me a coffee" class="w-5 h-5 mr-2" />
                <span class="font-medium">Buy me a coffee</span>
              </a>
            </div>
            <span class="text-cyan-200">Any support is greatly appreciated!</span>
          </div>

          <div class="pt-4">
            <Title size="text-4xl" align="left">FAQ</Title>
            <Faq />
          </div>

          <div class="pt-4">
            <Title size="text-4xl" align="left">Shameless Advertisement</Title>

            <a
              href="https://shipvote.in.fkn.space"
              target="_blank"
              class="flex gap-8 items-center
            bg-purple-900/60 hover:bg-purple-900/80 transition-colors duration-200
            border-2 border-purple-400/20
            backdrop-blur px-8 py-4 text-purple-50"
            >
              <svg
                class="h-16 w-16 flex-shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                xml:space="preserve"
                id="Layer_1"
                x="0"
                y="0"
                style="enable-background:new 0 0 2400 2800"
                version="1.1"
                viewBox="0 0 2400 2800"
                ><style>
                  .st1 {
                    fill: #9146ff;
                  }
                </style><path
                  d="m2200 1300-400 400h-400l-350 350v-350H600V200h1600z"
                  style="fill:#fff"
                /><g id="Layer_1-2"
                  ><path
                    d="M500 0 0 500v1800h600v500l500-500h400l900-900V0H500zm1700 1300-400 400h-400l-350 350v-350H600V200h1600v1100z"
                    class="st1"
                  /><path d="M1700 550h200v600h-200zM1150 550h200v600h-200z" class="st1" /></g
                ></svg
              >
              <div class="space-y-2">
                <div class="text-lg font-semibold">
                  Want to spice up your World of Warships stream?
                </div>
                <div class="text-base">
                  Check out the WoWS Shipvote extension for Twitch. Customise your votes and let
                  your viewers decide which ship you should play next. Needs to be installed by the
                  streamer.
                </div>
              </div>
            </a>
          </div>
        </div>
      </Box>
    </div>
  </div>
</div>
