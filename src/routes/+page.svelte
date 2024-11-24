<script lang="ts">
  import { Realm, login, user } from '$lib/store';
  import { onMount } from 'svelte';
  import { derived, type Readable } from 'svelte/store';
  import { type Reward } from '$lib/reward';
  import RewardStat from '$lib/components/RewardStat.svelte';
  import Faq from '$lib/components/FAQ.svelte';

  import warships from '$lib/assets/warships.json';
  import Title from '$lib/components/Title.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';
  import type { Ship } from '$lib/ship';

  import bmcLogo from '$lib/assets/bmc-logo.svg';
  import { Christmas2024 } from '$lib/rewards/christmas2024';
  import { BaseXP, Coal, SantasGiftCertificate, Steel, type Resource } from '$lib/resource';
  import RewardBreakdown from '$lib/components/RewardBreakdown.svelte';
  import GamblingSimulator from '$lib/components/GamblingSimulator.svelte';
  import { SantasMegaGiftContainer } from '$lib/containers/2024-santas-mega-gift-container';

  const activeEvent = new Christmas2024();

  onMount(() => {
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

    const unsubscribe = user.subscribe(($user) => {
      console.log('user', $user);
    });

    return () => {
      unsubscribe();
    };
  });

  function logout() {
    localStorage.removeItem('user');
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
      .filter((shiporError: Ship | Error) => {
        if (shiporError instanceof Error) {
          console.warn(shiporError.message);
          return false;
        }

        return true;
      });
  });

  const rewards = derived(shipsInPort, async ($shipsInPort) => {
    return (await $shipsInPort)
      .map((ship: Ship) => ({ ...activeEvent.calculateShipReward(ship), ship }))
      .filter((reward: Reward & { ship: Ship }) => reward.amount > 0)
      .sort((a: Reward, b: Reward) => {
        switch (a.resource) {
          case SantasGiftCertificate:
            return -1;
          case Steel:
            switch (b.resource) {
              case SantasGiftCertificate:
                return 1;
              case Steel:
                return a.amount - b.amount;
              default:
                return -1;
            }
          case Coal:
            switch (b.resource) {
              case SantasGiftCertificate:
              case Steel:
                return 1;
              case Coal:
                return a.amount - b.amount;
              default:
                return -1;
            }
        }
      });
  });

  interface EventStats {
    rewards: {
      [key: string]: {
        total: number;
        ships: number;
      };
    };
    conversions: {
      [key: string]: {
        container: any;
        source: Resource;
        total: number;
      };
    };
    totalRequiredXP: number;
  }

  const eventStats: Readable<Promise<EventStats>> = derived(rewards, async ($rewards) => {
    const res = (await $rewards).reduce(
      (acc: EventStats, reward: Reward & { ship: Ship }) => {
        return {
          rewards: {
            ...acc.rewards,
            [reward.resource.name]: {
              total: acc.rewards[reward.resource.name].total + reward.amount,
              ships: acc.rewards[reward.resource.name].ships + 1
            }
          },
          conversions: {},
          totalRequiredXP: acc.totalRequiredXP + reward.requiredXP
        };
      },
      {
        rewards: activeEvent.possibleResources.reduce(
          (acc, resource) => ({ ...acc, [resource.name]: { total: 0, ships: 0 } }),
          {}
        ),
        conversions: {},
        totalRequiredXP: 0
      }
    );

    // calculate container conversions
    for (const resourceName of Object.keys(res.rewards)) {
      const total = res.rewards[resourceName].total;
      const resource: Resource = activeEvent.possibleResources.find((r) => r.name === resourceName);
      if (!resource) {
        continue;
      }

      for (const conversion of resource.convertsTo || []) {
        const maxAmount = Math.floor(total / conversion.cost);

        if (res.conversions[conversion.container.name]) {
          res.conversions[conversion.container.name].total += maxAmount * conversion.returns;
          res.conversions[conversion.container.name].container = conversion.container;
        } else {
          res.conversions[conversion.container.name] = {
            total: maxAmount * conversion.returns,
            container: conversion.container,
            source: resource
          };
        }
      }
    }

    res.conversions = Object.keys(res.conversions).reduce((acc, key) => {
      if (res.conversions[key].total > 0) {
        return { ...acc, [key]: res.conversions[key] };
      }

      return acc;
    }, {});
    console.log(res);

    return res;
  });

  const maxAdditionalRewards = derived(shipsInPort, async ($shipsInPort) => {
    const ships = await $shipsInPort;

    return activeEvent.getMaxAdditionalRewards(ships);
  });

  const realmColors = {
    [Realm.EU]: 'text-cyan-300',
    [Realm.NA]: 'text-rose-400',
    [Realm.ASIA]: 'text-amber-300'
  };
</script>

<div class="space-y-12">
  <div class="space-y-4">
    <div
      class="flex gap-4 md:gap-0 md:flex-row flex-col-reverse md:items-center justify-between pr-1"
    >
      <Title size="text-4xl sm:text-6xl" align="left">
        <div class="flex gap-4 items-center">
          <div>Rewards</div>
          <div>
            <a
              href="https://blog.worldofwarships.com/blog/568"
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
        class="w-full sm:w-auto bg-white/10 backdrop-blur p-2 text-white text-sm flex flex-col header items-center justify-center"
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
      </div>
    </div>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 3xl:grid-cols-5 gap-4"
    >
      {#await $eventStats}
        {#each activeEvent.possibleResources as resource}
          <RewardStat title={resource.name} icon={resource.image} value={0} />
          <RewardStat title={resource.name} icon={resource.image} value={0} />
        {/each}
      {:then rewards}
        {#each activeEvent.possibleResources as resource}
          <RewardStat
            title={resource.name}
            icon={resource.image}
            value={rewards.rewards[resource.name].total}
          >
            from {rewards.rewards[resource.name].ships} ships
          </RewardStat>
        {/each}
        {#each Object.keys(rewards.conversions) as conversionStat}
          <RewardStat
            title={rewards.conversions[conversionStat].container.name}
            icon={rewards.conversions[conversionStat].container.icon}
            value={rewards.conversions[conversionStat].total}
          >
            by converting all {rewards.conversions[conversionStat].source.name}
          </RewardStat>
        {/each}
        {#await $maxAdditionalRewards}
          <RewardStat title="Additional Rewards" value={0} />
        {:then maxAdditionalRewards}
          <RewardStat title="Additional Rewards" value={maxAdditionalRewards}>
            Per battle over 1,000 Base XP
          </RewardStat>
        {:catch}
          <RewardStat title="Additional Rewards" value={0} />
        {/await}
      {:catch error}
        <ErrorMessage>{error.message}</ErrorMessage>
      {/await}
    </div>
  </div>

  <div>
    <Title size="text-4xl sm:text-6xl" align="left">
      Try your luck

      {#snippet subtitle()}
        <div>Obviously, this is not real. But you can simulate the real drop rates here.</div>
      {/snippet}
    </Title>
    <GamblingSimulator container={SantasMegaGiftContainer} />
  </div>

  <div>
    <Title size="text-4xl sm:text-6xl" align="left">Breakdown</Title>
    {#await $rewards}
      Loading
    {:then rewards}
      <RewardBreakdown {rewards} />
    {:catch error}
      <ErrorMessage>{error.message}</ErrorMessage>
    {/await}
  </div>

  <div class="space-y-8">
    <div>
      <Title size="text-4xl sm:text-6xl" align="left">About</Title>
      <div class="bg-slate-950/50 backdrop-blur-sm rounded-lg p-8 space-y-6 text-cyan-100">
        <p class="leading-relaxed">
          On this website, you can plan your Event rewards. It uses the ships you currently have in
          your port to calculate available rewards.
        </p>
        <div class="space-y-4">
          <p class="leading-relaxed">
            This tool was created by <strong class="text-cyan-300">Rukenshia</strong> on the EU
            Server. If you have any questions, feedback, or want to thank me, you can contact me on
            Discord at
            <strong class="text-cyan-300">Rukenshia</strong>
            or email me at
            <a
              href="mailto:svc-shipwhaling@ruken.pw"
              class="text-cyan-300 hover:text-cyan-100 underline transition-colors duration-200"
            >
              svc-shipwhaling@ruken.pw
            </a>.
          </p>
          <div class="flex items-center space-x-4">
            <span class="text-cyan-200">If you really loved using this website, you can also</span>
            <a
              href="https://buymeacoffee.com/rukenshia"
              target="_blank"
              class="inline-flex items-center text-sm px-4 py-1 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-cyan-100 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <img src={bmcLogo} alt="Buy me a coffee" class="w-5 h-5 mr-2" />
              <span class="font-medium">Buy me a coffee</span>
            </a>
          </div>

          <p>
            An extra shoutout to the calculator posted on <a
              href="https://www.reddit.com/r/WorldOfWarships/comments/1eva24m/2024_festive_rewards_calculator/"
              target="_blank"
              class="text-cyan-100 underline">Reddit by /u/adosztal</a
            > which I used to understand the event better.
          </p>
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
            class="block
            bg-purple-500/30 hover:bg-purple-500/50 transition-colors duration-200
            backdrop-blur px-8 py-4 text-purple-50 flex gap-8 items-center"
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
                Check out the WoWS Shipvote extension for Twitch. Customise your votes and let your
                viewers decide which ship you should play next. Needs to be installed by the
                streamer.
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
