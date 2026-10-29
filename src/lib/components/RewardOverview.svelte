<script lang="ts">
  import type { Resource } from '$lib/resource';
  import type { EventStats } from '$lib/rewardCalculator';
  import { prettyAmount } from '$lib/util';
  import Box from './Box.svelte';
  import Tooltip from './Tooltip.svelte';

  interface Props {
    resources: Resource[];
    current?: EventStats;
    previouslyOwned?: EventStats;
    modify?: (value: number, resource: Resource) => number;
  }

  let { resources, current, previouslyOwned, modify = (value) => value }: Props = $props();

  // the event currency (the resource that converts into containers etc.) gets the hero card
  let hero = $derived(resources.find((resource) => resource.convertsTo?.length) ?? resources[0]);
  let others = $derived(resources.filter((resource) => resource !== hero));
  let conversions = $derived(
    Object.values(current?.conversions ?? {}).filter(
      (conversion) => conversion.source.name === hero.name
    )
  );

  function stat(stats: EventStats | undefined, resource: Resource) {
    const reward = stats?.rewards[resource.name];

    return {
      total: modify(reward?.total ?? 0, resource),
      ships: reward?.ships ?? 0
    };
  }

  function ships(count: number) {
    return `${prettyAmount(count)} ship${count === 1 ? '' : 's'}`;
  }
</script>

{#snippet resourceIcon(resource: Resource, size: string)}
  {#if resource.image}
    <img src={resource.image} alt="" class="{size} shrink-0 object-contain" />
  {/if}
{/snippet}

{#snippet previouslyOwnedNote(resource: Resource)}
  {@const previous = stat(previouslyOwned, resource)}
  {#if previous.total > 0}
    <Tooltip>
      {#snippet tooltip()}
        You could earn these by re-buying ships you had in your port before. Pick which ones count
        in the Breakdown section below.
      {/snippet}
      <span class="cursor-help text-emerald-400">
        +{prettyAmount(previous.total)} from {ships(previous.ships)} previously owned
      </span>
    </Tooltip>
  {/if}
{/snippet}

<div class="grid gap-3 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
  <!-- Event currency -->
  {#if hero}
    {@const heroStat = stat(current, hero)}
    <Box variant="dark" padding="p-0" class="overflow-hidden">
      <div class="flex w-full flex-1 flex-col gap-5 p-6 lg:p-8">
        <div>
          <div class="header text-sm font-semibold uppercase tracking-widest text-cyan-300">
            {hero.name}
          </div>
          <div class="mt-1 flex items-center gap-4">
            <span class="font-sans text-6xl font-bold text-white lg:text-7xl"
              >{prettyAmount(heroStat.total)}</span
            >
            {@render resourceIcon(hero, 'h-14 w-14 lg:h-16 lg:w-16')}
          </div>
          <div class="mt-1 flex flex-col text-sm text-gray-400">
            <span>from {ships(heroStat.ships)} in port</span>
            {@render previouslyOwnedNote(hero)}
          </div>
        </div>

        {#if conversions.length}
          <div class="flex flex-col gap-2">
            <div class="header text-xs uppercase tracking-wide text-gray-400">
              Spend them on one of
            </div>
            <ul class="flex flex-col gap-1">
              {#each conversions as conversion (conversion.target.name)}
                <li class="flex items-center gap-3 bg-slate-950/40 py-2 pl-2 pr-3">
                  {#if conversion.target.icon}
                    <img
                      src={conversion.target.icon}
                      alt=""
                      class="h-9 w-9 shrink-0 object-contain"
                    />
                  {:else}
                    <span class="h-9 w-9 shrink-0" aria-hidden="true"></span>
                  {/if}
                  <span class="min-w-0 flex-1 truncate text-sm text-white"
                    >{conversion.target.name}</span
                  >
                  <span class="font-sans text-lg font-bold text-white"
                    >{prettyAmount(conversion.total)}</span
                  >
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    </Box>
  {/if}

  <!-- Other resources -->
  <div class="grid gap-3">
    {#each others as resource (resource.name)}
      {@const resourceStat = stat(current, resource)}
      <Box variant="dark" padding="p-0">
        <div class="flex w-full flex-1 flex-col justify-center gap-1 p-5 lg:px-6">
          <div class="header text-sm font-semibold uppercase tracking-widest text-cyan-300">
            {resource.name}
          </div>
          <div class="flex items-center gap-3">
            <span class="font-sans text-4xl font-bold text-white lg:text-5xl"
              >{prettyAmount(resourceStat.total)}</span
            >
            {@render resourceIcon(resource, 'h-9 w-9 lg:h-11 lg:w-11')}
          </div>
          <div class="flex flex-col text-sm text-gray-400">
            <span>from {ships(resourceStat.ships)} in port</span>
            {@render previouslyOwnedNote(resource)}
          </div>
        </div>
      </Box>
    {/each}
  </div>
</div>
