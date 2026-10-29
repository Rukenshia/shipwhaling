<script lang="ts">
  import { Realm, login, user } from '$lib/store';
  import { onMount } from 'svelte';
  import { derived, writable } from 'svelte/store';
  import RewardOverview from '$lib/components/RewardOverview.svelte';
  import Faq from '$lib/components/FAQ.svelte';

  import warships from '$lib/assets/warships.json';
  import Title from '$lib/components/Title.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';
  import type { Ship } from '$lib/ship';

  import bmcLogo from '$lib/assets/bmc-logo.svg';
  import { Coal, Steel, type Resource } from '$lib/resource';
  import TabbedRewardBreakdown from '$lib/components/TabbedRewardBreakdown.svelte';
  import BattleCalculator from '$lib/components/BattleCalculator.svelte';
  import { slide } from 'svelte/transition';
  import ModifierSelect from '$lib/components/ModifierSelect.svelte';
  import { CoalPort, SteelPort } from '$lib/modifiers';
  import { Christmas2026 } from '$lib/rewards/christmas2026';
  import Christmas2026Shop from '$lib/components/events/Christmas2026Shop.svelte';
  import Box from '$lib/components/Box.svelte';
  import { createRewardsStore, createEventStatsStore } from '$lib/rewardCalculator';

  const activeEvent = new Christmas2026();
  const excludedPreviouslyOwnedShipIdsStorageKey = 'shipwhaling:excluded-previously-owned-ship-ids';

  let showSettings = $state(false);
  let coalModifier = $state(1);
  let steelModifier = $state(1);
  const excludedPreviouslyOwnedShipIds = writable<ReadonlySet<number>>(new Set());

  function loadExcludedPreviouslyOwnedShipIds(): Set<number> {
    const storedValue = localStorage.getItem(excludedPreviouslyOwnedShipIdsStorageKey);

    if (!storedValue) {
      return new Set();
    }

    try {
      const parsedValue: unknown = JSON.parse(storedValue);

      if (!Array.isArray(parsedValue)) {
        return new Set();
      }

      return new Set(
        parsedValue.filter((shipId): shipId is number => Number.isInteger(shipId) && shipId > 0)
      );
    } catch {
      return new Set();
    }
  }

  function setPreviouslyOwnedShipIncluded(shipId: number, included: boolean) {
    excludedPreviouslyOwnedShipIds.update((excludedShipIds) => {
      const nextExcludedShipIds = new Set(excludedShipIds);

      if (included) {
        nextExcludedShipIds.delete(shipId);
      } else {
        nextExcludedShipIds.add(shipId);
      }

      localStorage.setItem(
        excludedPreviouslyOwnedShipIdsStorageKey,
        JSON.stringify([...nextExcludedShipIds].sort((a, b) => a - b))
      );

      return nextExcludedShipIds;
    });
  }

  function saveModifiers() {
    localStorage.setItem('coalModifier', `${coalModifier}`);
    localStorage.setItem('steelModifier', `${steelModifier}`);
  }

  onMount(() => {
    // load modifiers
    coalModifier = parseFloat(localStorage.getItem('coalModifier') || '1');
    steelModifier = parseFloat(localStorage.getItem('steelModifier') || '1');
    excludedPreviouslyOwnedShipIds.set(loadExcludedPreviouslyOwnedShipIds());

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

    const unsubscribe = user.subscribe(() => {});

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

  function resolveShips(shipIds: number[], inPort: boolean): Ship[] {
    const resolvedShips: Ship[] = [];

    for (const shipId of shipIds) {
      const ship = warships.data.find((candidate) => candidate.id === shipId);

      if (!ship) {
        console.warn(`unknown ship ${shipId}`);
        continue;
      }

      resolvedShips.push({ ...ship, inPort });
    }

    return resolvedShips;
  }

  const shipsInPort = derived(user, async ($user): Promise<Ship[]> => {
    if (!$user) {
      return [];
    }

    const ships: number[] = await $user.getShipsInPort();

    return resolveShips(ships, true);
  });

  const previouslyOwnedShips = derived(user, async ($user): Promise<Ship[]> => {
    if (!$user) {
      return [];
    }

    const ships = await $user.getPreviouslyOwnedShipIds();

    return resolveShips(ships, false);
  });

  const includedPreviouslyOwnedShips = derived(
    [previouslyOwnedShips, excludedPreviouslyOwnedShipIds],
    async ([$ships, $excludedShipIds]): Promise<Ship[]> => {
      return (await $ships).filter((ship) => !$excludedShipIds.has(ship.id));
    }
  );

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
  const includedPreviouslyOwnedRewards = createRewardsStore(
    includedPreviouslyOwnedShips,
    activeEvent
  );

  const eventStats = createEventStatsStore(rewards, activeEvent);
  const previouslyOwnedEventStats = createEventStatsStore(
    includedPreviouslyOwnedRewards,
    activeEvent
  );

  const realmColors = {
    [Realm.EU]: 'text-cyan-300',
    [Realm.NA]: 'text-rose-400',
    [Realm.ASIA]: 'text-amber-300'
  };
</script>

<div class="space-y-12 max-w-4xl mx-auto">
  <aside
    class="header flex items-start gap-3 border-2 border-amber-300/40 bg-amber-950/50 px-4 py-3 text-amber-50 shadow-lg backdrop-blur sm:items-center sm:px-5"
    aria-label="Event start information"
  >
    <svg
      class="mt-0.5 h-5 w-5 flex-none text-amber-300 sm:mt-0"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-3a1 1 0 1 0-2 0 1 1 0 0 0 2 0ZM9 9a1 1 0 0 0 0 2v2a1 1 0 1 0 0 2h1a1 1 0 1 0 0-2v-3a1 1 0 0 0-1-1Z"
        clip-rule="evenodd"
      />
    </svg>
    <p class="text-sm leading-5 sm:text-base">
      Festive Rewards start with the release of
      <a
        href="https://blog.worldofwarships.com/blog/closed-test-1511-new-year-celebrations-santas-gifts-and-the-ice-station-port"
        target="_blank"
        rel="noreferrer"
        class="font-semibold text-amber-200 underline decoration-amber-300/60 underline-offset-2 transition-colors hover:text-white"
        >Update 15.11</a
      >
    </p>
  </aside>

  <div class="space-y-4">
    <div
      class="flex gap-4 md:gap-0 md:flex-row flex-col-reverse md:items-center justify-between pr-1"
    >
      <div class="min-w-0 flex-1 md:pr-6">
        <Title size="text-3xl sm:text-5xl lg:text-6xl" align="left">
          Festive Rewards

          {#snippet subtitle()}
            <div>The number of resources you can earn based on your ships in port.</div>
          {/snippet}
        </Title>
        <div class="flex flex-wrap items-center gap-2">
          <a
            href="https://blog.worldofwarships.com/blog/closed-test-1511-new-year-celebrations-santas-gifts-and-the-ice-station-port"
            target="_blank"
            rel="noreferrer"
            class="header inline-flex border-2 border-white/40 bg-white/20 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur transition-colors duration-200 hover:bg-white/30"
          >
            View event rules
          </a>
          <a
            href="https://buymeacoffee.com/rukenshia"
            target="_blank"
            rel="noreferrer"
            class="header inline-flex items-center gap-2 border border-amber-200/30 bg-amber-400/20 px-3 py-2 text-sm font-semibold text-amber-50 backdrop-blur transition-colors duration-200 hover:border-amber-200/60 hover:bg-amber-200/10 hover:text-white"
          >
            <img src={bmcLogo} alt="" class="h-4 w-4" />
            Buy me a coffee
          </a>
        </div>
      </div>
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
      {#await Promise.all([$eventStats, $previouslyOwnedEventStats])}
        <RewardOverview resources={activeEvent.possibleResources} />
      {:then [currentRewards, previousRewards]}
        <RewardOverview
          resources={activeEvent.possibleResources}
          current={currentRewards}
          previouslyOwned={previousRewards}
          modify={(value, resource) => applyModifier(value, resource, coalModifier, steelModifier)}
        />
      {:catch error}
        <ErrorMessage>{error.message}</ErrorMessage>
      {/await}
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
    <Title size="text-4xl sm:text-6xl p-0 m-0" align="left">
      Container Simulator

      {#snippet subtitle()}
        <div>Simulate opening Santa's Gift containers and view drop rates</div>
      {/snippet}
    </Title>
    {#await $shipsInPort}
      Loading...
    {:then shipsInPort}
      <Christmas2026Shop {shipsInPort} />
    {:catch error}
      <ErrorMessage>{error.message}</ErrorMessage>
    {/await}
  </div>

  <div>
    <Title size="text-4xl sm:text-6xl" align="left">
      Breakdown

      {#snippet subtitle()}
        <div>
          Choose which previously owned ships to include in the calculations. Your exclusions are
          saved in this browser.
        </div>
      {/snippet}
    </Title>
    {#await Promise.all([$rewards, $previouslyOwnedRewards])}
      Loading
    {:then [rewards, previouslyOwnedRewards]}
      <TabbedRewardBreakdown
        currentRewards={rewards}
        {previouslyOwnedRewards}
        excludedPreviouslyOwnedShipIds={$excludedPreviouslyOwnedShipIds}
        onPreviouslyOwnedShipInclusionChange={setPreviouslyOwnedShipIncluded}
      />
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
