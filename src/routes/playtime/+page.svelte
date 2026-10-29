<script lang="ts">
  import Box from '$lib/components/Box.svelte';
  import Title from '$lib/components/Title.svelte';
  import { formatNumber } from '$lib/duration';
  import { restoreLogin } from '$lib/store';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';
  import { onMount } from 'svelte';

  let battleLifeTime = $state<number | null>(null);
  let username = $state('');
  let error = $state<Error | null>(null);

  const duration = $derived.by(() => {
    const seconds = Math.max(0, Math.floor(battleLifeTime ?? 0));

    return {
      days: Math.floor(seconds / 86_400),
      hours: Math.floor((seconds % 86_400) / 3_600),
      minutes: Math.floor((seconds % 3_600) / 60)
    };
  });

  async function loadPlaytime() {
    error = null;
    battleLifeTime = null;

    try {
      const restored = restoreLogin();
      if (!restored) {
        window.location.href = '/login';
        return;
      }
      username = restored.username;
      battleLifeTime = await restored.getBattleLifeTime();
    } catch (loadError) {
      error =
        loadError instanceof Error ? loadError : new Error('Your playtime could not be loaded.');
    }
  }

  onMount(() => {
    loadPlaytime();
  });
</script>

<svelte:head>
  <title>Lifetime Playtime · Warship Whaling</title>
  <meta
    name="description"
    content="See the total time your World of Warships account has spent in battle."
  />
</svelte:head>

<div class="mx-auto max-w-3xl">
  <Box variant="dark" padding="p-0" class="overflow-hidden">
    <div class="w-full border-t-2 border-cyan-200/50">
      <div class="px-6 pb-6 pt-7 sm:px-10 sm:pb-8 sm:pt-9">
        <Title size="text-3xl sm:text-4xl">
          Lifetime Playtime

          {#snippet subtitle()}
            <div>Your total time spent in World of Warships battles.</div>
          {/snippet}
        </Title>
      </div>

      {#if battleLifeTime !== null}
        <div
          class="border-t border-white/15 bg-cyan-950/35 px-5 pb-7 pt-6 text-center sm:px-10 sm:pb-9 sm:pt-8"
          aria-live="polite"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/65 sm:text-sm">
            {username ? `${username} has played for` : 'You have played for'}
          </p>

          <dl
            class="mt-5 grid grid-cols-3 divide-x divide-white/15 border-y border-white/15 bg-slate-950/20 sm:mt-6"
            aria-label="Playtime duration"
          >
            <div class="px-2 py-5 sm:px-6 sm:py-7">
              <dd class="text-4xl font-bold leading-none text-white drop-shadow-2xl sm:text-6xl">
                {formatNumber(duration.days)}
              </dd>
              <dt class="mt-2 text-xs uppercase tracking-[0.18em] text-cyan-100/60 sm:text-sm">
                {duration.days === 1 ? 'Day' : 'Days'}
              </dt>
            </div>
            <div class="px-2 py-5 sm:px-6 sm:py-7">
              <dd class="text-4xl font-bold leading-none text-white drop-shadow-2xl sm:text-6xl">
                {duration.hours}
              </dd>
              <dt class="mt-2 text-xs uppercase tracking-[0.18em] text-cyan-100/60 sm:text-sm">
                {duration.hours === 1 ? 'Hour' : 'Hours'}
              </dt>
            </div>
            <div class="px-2 py-5 sm:px-6 sm:py-7">
              <dd class="text-4xl font-bold leading-none text-white drop-shadow-2xl sm:text-6xl">
                {duration.minutes}
              </dd>
              <dt class="mt-2 text-xs uppercase tracking-[0.18em] text-cyan-100/60 sm:text-sm">
                {duration.minutes === 1 ? 'Minute' : 'Minutes'}
              </dt>
            </div>
          </dl>

          <p class="mt-5 text-sm text-cyan-50/65 sm:text-base">
            <span class="font-semibold text-cyan-50/90">
              {formatNumber(Math.floor(battleLifeTime / 3_600))}
            </span>
            total battle hours
          </p>
        </div>
      {:else if error}
        <ErrorMessage {error}>{error.message}</ErrorMessage>
      {:else}
        <div
          class="border-t border-white/15 bg-cyan-950/35 px-5 py-8 text-center text-cyan-50/80 sm:px-10"
          role="status"
          aria-live="polite"
        >
          Loading your lifetime playtime…
        </div>
      {/if}
    </div>
  </Box>
</div>
