<script lang="ts">
  import Faq from '$lib/components/FAQ.svelte';
  import Title from '$lib/components/Title.svelte';
  import { Realm } from '$lib/store';
  import { onMount } from 'svelte';

  const inactive = true;

  onMount(() => {
    // page is inactive: redirect to inactive
    if (inactive) {
      window.location.href = '/inactive';
      return;
    }
  });

  async function redirectToLogin(realm: 'eu' | 'com' | 'asia') {
    const expiresAt = Date.now() + 3600 * 24 * 1;
    window.location.href = `https://api.worldoftanks.${realm}/wot/auth/login/?application_id=${import.meta.env.VITE_WARGAMING_APP_ID}&expires_at=${expiresAt}&redirect_uri=${import.meta.env.VITE_BASE_URL}/login/callback?realm=${realm}`;
  }

  const realms = [
    {
      name: Realm.EU,
      label: 'EU',
      colorClasses: 'bg-cyan-500/40 hover:bg-cyan-500/60'
    },
    {
      name: Realm.NA,
      label: 'NA',
      colorClasses: 'bg-rose-700/50 hover:bg-rose-700/70'
    },
    {
      name: Realm.ASIA,
      label: 'ASIA',
      colorClasses: 'bg-amber-600/60 hover:bg-amber-600/80'
    }
  ];
</script>

<div class="space-y-8">
  <div class="max-w-xl mx-auto rounded p-8 bg-slate-950/20 shadow-inner inset-0">
    <Title>
      Select a Server to log in

      <div slot="subtitle">You will be redirected to the Wargaming login.</div>
    </Title>

    <div class="grid grid-cols-3 gap-8 items-center justify-center items-stretch">
      {#each realms as realm}
        <button
          class={`p-8 aspect-square rounded-lg text-white font-bold transition-colors duration-300 ease-in-out ${realm.colorClasses}`}
          on:click={() => redirectToLogin(realm.name)}
        >
          {realm.label}
        </button>
      {/each}
    </div>
  </div>

  <div class="max-w-xl mx-auto rounded p-8 bg-slate-950/20 shadow-inner inset-0 space-y-8">
    <div>
      <Title align="left">About</Title>

      <p>
        This website is a tool to help you plan your Anniversary Event rewards and purchases. In
        order to do that, you need to log in with your Wargaming account.
      </p>
    </div>

    <div>
      <Title align="left">Privacy</Title>

      <p>
        This website does not collect any personal information. The login happens purely in your
        browser. No data is stored on any server.
      </p>
    </div>

    <div>
      <Title align="left">FAQ</Title>

      <Faq />
    </div>
  </div>
</div>
