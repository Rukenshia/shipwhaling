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
    <Title size="text-7xl" align="left">
      Rewards

      <div slot="subtitle">The number of resources you can earn based on your ships in port.</div>
    </Title>
    <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {#await $totalRewards}
        <RewardStat title="Festive Tokens" value={0} />
        <RewardStat title="Steel" value={0} />
        <RewardStat title="Base XP Required" value={0} />
        <RewardStat title="Performance Bonus" value={0} />
      {:then rewards}
        <RewardStat title="Festive Tokens" value={rewards.festiveTokens} />
        <RewardStat title="Steel" value={rewards.steel} />
        <RewardStat title="Base XP Required (worst case)" value={rewards.baseXPRequired} />
        {#await $maxAdditionalRewards}
          <RewardStat title="Additional Rewards" value={0} />
        {:then maxAdditionalRewards}
          <RewardStat title="Additional Rewards" value={maxAdditionalRewards} />
        {:catch}
          <RewardStat title="Additional Rewards" value={0} />
        {/await}
      {:catch error}
        <ErrorMessage>{error.message}</ErrorMessage>
      {/await}
    </div>
  </div>
  <div>
    <Title size="text-6xl" align="left"
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
    <Title size="text-6xl" align="left">Breakdown</Title>
    {#await $rewards}
      Loading
    {:then rewards}
      <div class="bg-slate-950/50 rounded p-8">
        <div class="overflow-y-auto max-h-[30vh]">
          <table class="w-full text-left">
            <thead>
              <tr class="text-gray-400 text-lg uppercase">
                <th class="pl-2">Ship</th>
                <th>Base XP Requirement</th>
                <th>Reward</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-cyan-800 rounded text-cyan-100">
              {#each rewards as reward}
                <tr class="odd:bg-cyan-950/40">
                  <td class="pl-2">{reward.ship.name}</td>
                  <td>{reward.baseXPRequired}</td>
                  <td>
                    {#if reward.festiveTokens > 0}
                      Festive Tokens
                    {:else if reward.steel > 0}
                      Steel
                    {:else}
                      None
                    {/if}
                  </td>
                  <td>
                    {#if reward.festiveTokens > 0}
                      {reward.festiveTokens}
                    {:else if reward.steel > 0}
                      {reward.steel}
                    {:else}
                      0
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

  <div>
    <Title size="text-6xl" align="left">About</Title>

    <div class="bg-slate-950/50 rounded p-8">
      <p>
        On this website, you can plan your Anniversary Event rewards and purchases. It uses the
        ships you currently have in your port to calculate available rewards.
      </p>

      <p class="mb-8">
        This tool was created by <strong>Rukenshia</strong> on the EU Server. If you have any
        questions, feedback, or want to thank me, you can contact me on Discord at
        <strong>Rukenshia#4396</strong>
        or email me at
        <a href="mailto:svc-shipwhaling@ruken.pw" class="text-cyan-100 underline"
          >svc-shipwhaling@ruken.pw</a
        >. If you really loved using this website, you can also
        <a href="https://buymeacoffee.com/rukenshia" class="text-cyan-100 underline"
          >Buy me a coffee</a
        >.
      </p>

      <Title size="text-4xl" align="left">FAQ</Title>

      <Faq />
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
