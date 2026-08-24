<script lang="ts">
  import Box from '$lib/components/Box.svelte';
  import Title from '$lib/components/Title.svelte';
  import { formatNumber } from '$lib/duration';
  import { login, user } from '$lib/store';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  let battleLifeTime = $state<number | null>(null);
  let username = $state('');
  let error = $state(false);

  const duration = $derived.by(() => {
    const seconds = Math.max(0, Math.floor(battleLifeTime ?? 0));

    return {
      days: Math.floor(seconds / 86_400),
      hours: Math.floor((seconds % 86_400) / 3_600),
      minutes: Math.floor((seconds % 3_600) / 60)
    };
  });

  async function loadPlaytime() {
    error = false;

    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      window.location.href = '/login';
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.expires_at * 1000 < Date.now()) {
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }

      login(parsedUser);
      username = parsedUser.username;
      battleLifeTime = await get(user).getBattleLifeTime();
    } catch (loadError) {
      console.error('Could not load battle lifetime', loadError);
      error = true;
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
        <div
          role="alert"
          class="border-t border-rose-300/25 bg-rose-950/50 px-5 py-6 text-center text-rose-50 sm:px-10"
        >
          <p class="font-semibold">Your playtime could not be loaded.</p>
          <p class="mt-1 text-sm text-rose-100/80">Please try again in a moment.</p>
          <button
            class="mt-4 border-2 border-white/30 bg-white/10 px-5 py-2 font-semibold uppercase tracking-wider text-white transition hover:bg-white/20"
            onclick={loadPlaytime}
          >
            Try again
          </button>
        </div>
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
