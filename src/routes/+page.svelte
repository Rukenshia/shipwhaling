<script lang="ts">
  import { login, user } from '$lib/store';
  import { onMount } from 'svelte';
  import { derived, type Readable } from 'svelte/store';
  import { type Reward, calculateShipReward, getMaxAdditionalRewards } from '$lib/reward';
  import RewardStat from '$lib/components/RewardStat.svelte';
  import Faq from '$lib/components/FAQ.svelte';

  import warships from '$lib/assets/warships.json';
  import Title from '$lib/components/Title.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';
  import type { Ship } from '$lib/ship';
  import Shop from '$lib/components/Shop.svelte';

  import bmcLogo from '$lib/assets/bmc-logo.svg';

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
      console.log($user);
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
    console.log('fetching ships in port');
    console.log($user);
    const ships = await $user.getShipsInPort();

    return ships.map((shipId: number) => {
      return warships.data.find((ship) => ship.id === shipId);
    });
  });

  const rewards = derived(shipsInPort, async ($shipsInPort) => {
    return (await $shipsInPort)
      .map((ship: Ship) => ({ ...calculateShipReward(ship), ship }))
      .filter((reward: Reward) => reward.festiveTokens > 0 || reward.steel > 0)
      .sort(
        (
          a: { steel: number; festiveTokens: number },
          b: { steel: number; festiveTokens: number }
        ) => {
          // Order by Steel first, then Festive Tokens. Always order by amount
          if (a.steel > b.steel) {
            return -1;
          } else if (a.steel < b.steel) {
            return 1;
          } else {
            if (a.festiveTokens > b.festiveTokens) {
              return -1;
            } else if (a.festiveTokens < b.festiveTokens) {
              return 1;
            } else {
              return 0;
            }
          }
        }
      );
  });

  const totalRewards: Readable<Promise<Reward & { ship: Ship }>> = derived(
    rewards,
    async ($rewards) => {
      const res = (await $rewards).reduce(
        (acc: Reward & { ship: Ship }, reward: Reward & { ship: Ship }) => {
          return {
            festiveTokens: acc.festiveTokens + reward.festiveTokens,
            steel: acc.steel + reward.steel,
            baseXPRequired: acc.baseXPRequired + reward.baseXPRequired
          };
        },
        {
          festiveTokens: 0,
          steel: 0,
          baseXPRequired: 0
        }
      );

      return res;
    }
  );

  const maxAdditionalRewards = derived(shipsInPort, async ($shipsInPort) => {
    const ships = await $shipsInPort;

    return getMaxAdditionalRewards(ships);
  });
</script>

<div class="space-y-12">
  <div>
    <Title size="text-4xl sm:text-6xl" align="left">
      <div class="flex gap-4 items-center">
        <div>Rewards</div>
        <div>
          <a
            href="https://blog.worldofwarships.com/blog/552"
            target="_blank"
            class="block bg-white/20 hover:bg-white/30 transition-colors duration-200 backdrop-blur border-white/40 border-2 px-4 py-1 sm:py-2 text-white text-base sm:text-lg"
          >
            Rules
          </a>
        </div>
      </div>

      <div slot="subtitle">The number of resources you can earn based on your ships in port.</div>
    </Title>
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {#await $totalRewards}
        <RewardStat title="Festive Tokens" value={0} />
        <RewardStat title="Steel" value={0} />
        <RewardStat title="Base XP Required" value={0} />
        <RewardStat title="Performance Bonus" value={0} />
      {:then rewards}
        <RewardStat title="Festive Tokens" value={rewards.festiveTokens} />
        <RewardStat title="Steel" value={rewards.steel} />
        <RewardStat title="Base XP Required" value={rewards.baseXPRequired}>
          Worst case scenario
        </RewardStat>
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
    <Title size="text-4xl sm:text-6xl" align="left"
      >Shop

      <div slot="subtitle">Get an approximation of how you can spend your tokens.</div>
    </Title>
    {#await $totalRewards}
      Loading
    {:then totalRewards}
      <Shop tokens={totalRewards.festiveTokens}></Shop>
    {:catch error}
      <ErrorMessage>{error.message}</ErrorMessage>
    {/await}
  </div>
  <div>
    <Title size="text-4xl sm:text-6xl" align="left">Breakdown</Title>
    {#await $rewards}
      Loading
    {:then rewards}
      <div class="bg-slate-950/50 backdrop-blur-sm rounded p-2 sm:p-8">
        <div class="w-full overflow-y-auto max-h-[30vh]">
          <table class="w-full text-left">
            <thead>
              <tr class="text-gray-400 text-lg uppercase">
                <th class="pl-2">Ship</th>
                <th>
                  <span class="hidden sm:inline">Base XP Requirement</span>
                  <span class="sm:hidden">BXP</span>
                </th>
                <th class="text-right">Reward</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-cyan-800 rounded text-cyan-100">
              {#each rewards as reward}
                <tr class="odd:bg-cyan-950/40">
                  <td class="pl-2">{reward.ship.name}</td>
                  <td>{reward.baseXPRequired}</td>
                  <td class="text-right">
                    {#if reward.festiveTokens > 0}
                      {reward.festiveTokens}
                    {:else if reward.steel > 0}
                      {reward.steel}
                    {:else}
                      0
                    {/if}
                    {#if reward.festiveTokens > 0}
                      Festive Tokens
                    {:else if reward.steel > 0}
                      Steel
                    {:else}
                      None
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {:catch error}
      <ErrorMessage>{error.message}</ErrorMessage>
    {/await}
  </div>

  <button
    class="mt-4 w-full h-full bg-rose-500/20 hover:bg-rose-500/40 transition-colors duration-200 px-8 py-4 border-2 border-rose-600/50 backdrop-blur text-rose-500 text-lg uppercase tracking-wider font-semibold"
    on:click={() => logout()}
  >
    <h5>Log out</h5>
  </button>

  <div class="space-y-8">
    <div>
      <Title size="text-4xl sm:text-6xl" align="left">About</Title>
      <div class="bg-slate-950/50 backdrop-blur-sm rounded-lg p-8 space-y-6 text-cyan-100">
        <p class="leading-relaxed">
          On this website, you can plan your Anniversary Event rewards and purchases. It uses the
          ships you currently have in your port to calculate available rewards.
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
              class="h-16 w-16"
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

<style>
  /* width */
  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    @apply bg-cyan-950 rounded-lg;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    @apply bg-cyan-300/50 rounded-lg;
  }
</style>
