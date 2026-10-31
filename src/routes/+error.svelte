<script lang="ts">
  import { base } from '$app/paths';
  import { page } from '$app/state';
  import bmcLogo from '$lib/assets/bmc-logo.svg';

  let notFound = $derived(page.status === 404);
</script>

<svelte:head>
  <title>{notFound ? 'Ship not found' : 'Something went wrong'} | Warship Whaling</title>
</svelte:head>

<main class="mx-auto mb-12 flex max-w-xl flex-col items-center gap-6 text-center">
  <div class="header text-7xl font-bold text-white/20 sm:text-8xl">{page.status}</div>
  <div>
    <h1 class="header text-3xl font-bold uppercase text-white sm:text-4xl">
      {notFound ? 'This ship sank' : 'Something went wrong'}
    </h1>
    <p class="mt-3 text-cyan-100/80">
      {#if notFound}
        Whatever was here took everything with it.
      {:else}
        {page.error?.message ?? 'An unexpected error happened.'}
      {/if}
    </p>
  </div>
  <div class="flex flex-wrap items-center justify-center gap-2">
    <a
      href={`${base}/`}
      class="header inline-flex border-2 border-white/40 bg-white/20 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur transition-colors duration-200 hover:bg-white/30"
    >
      Back to port
    </a>
    {#if notFound}
      <a
        href="https://buymeacoffee.com/rukenshia"
        target="_blank"
        rel="noreferrer"
        class="header inline-flex items-center gap-2 border border-amber-200/30 bg-amber-400/20 px-3 py-2 text-sm font-semibold text-amber-50 backdrop-blur transition-colors duration-200 hover:border-amber-200/60 hover:bg-amber-200/10 hover:text-white"
      >
        <img src={bmcLogo} alt="" class="h-4 w-4" />
        Buy me a coffee
      </a>
    {/if}
  </div>
</main>
