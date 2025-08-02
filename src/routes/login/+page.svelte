<script lang="ts">
  import Box from '$lib/components/Box.svelte';
  import Faq from '$lib/components/FAQ.svelte';
  import Title from '$lib/components/Title.svelte';
  import { Realm } from '$lib/store';

  async function redirectToLogin(realm: 'eu' | 'com' | 'asia') {
    const expiresAt = Date.now() + 3600 * 24 * 1;
    window.location.href = `https://api.worldoftanks.${realm}/wot/auth/login/?application_id=${import.meta.env.VITE_WARGAMING_APP_ID}&expires_at=${expiresAt}&redirect_uri=${import.meta.env.VITE_BASE_URL}/login/callback?realm=${realm}`;
  }

  const realms = [
    {
      name: Realm.EU,
      label: 'EU',
      colorClasses: 'bg-cyan-500/40 hover:bg-cyan-500/60 outline-cyan-200/20'
    },
    {
      name: Realm.NA,
      label: 'NA',
      colorClasses: 'bg-rose-700/50 hover:bg-rose-700/70 outline-rose-200/20'
    },
    {
      name: Realm.ASIA,
      label: 'ASIA',
      colorClasses: 'bg-amber-600/60 hover:bg-amber-600/80 outline-amber-200/20'
    }
  ];
</script>

<div class="space-y-8 max-w-2xl mx-auto">
  <Box variant="dark">
    <Title>
      Select a Server to log in

      {#snippet subtitle()}
        <div>You will be redirected to the Wargaming login.</div>
      {/snippet}
    </Title>

    <div class="grid grid-cols-3 gap-8 items-center justify-center">
      {#each realms as realm}
        <button
          class={`p-8 aspect-square outline outline-2 -outline-offset-2 text-white font-bold transition-colors duration-300 ease-in-out ${realm.colorClasses}`}
          onclick={() => redirectToLogin(realm.name)}
        >
          {realm.label}
        </button>
      {/each}
    </div>
  </Box>

  <Box variant="dark">
    <div>
      <Title align="left">About</Title>

      <p>
        This website is a tool to help you plan your Christmas Event rewards. In order to do that,
        you need to log in with your Wargaming account.
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
  </Box>
</div>
