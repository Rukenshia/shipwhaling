<script lang="ts">
  import { Realm, login } from '$lib/store';
  import { onMount } from 'svelte';

  let success = $state(true);

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');

    if (status !== 'ok') {
      console.error('Login failed');
      success = false;
    }

    const realm = urlParams.get('realm');
    const accessToken = urlParams.get('access_token');
    const expiresAt = urlParams.get('expires_at');
    const nickname = urlParams.get('nickname');
    const account_id = urlParams.get('account_id');

    if (realm && accessToken && expiresAt && nickname && account_id) {
      login({
        realm: realm as Realm,
        token: accessToken,
        account_id: account_id,
        username: nickname,
        expires_at: parseInt(expiresAt)
      });

      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }
  });
</script>

{#if success}
  <div class="max-w-lg mx-auto bg-slate-950/20 rounded p-8 shadow-inner inset-0">
    Login Successful. Redirecting...
  </div>
{:else}
  <div class="max-w-lg mx-auto bg-rose-800/60 rounded p-8 shadow-inner inset-0">
    There was a problem while trying to log you in. Please try again. If the problem perists, please
    contact me on Discord (Rukenshia) or via <a
      class="text-cyan-50 underline"
      href="mailto:svc-shipwhaling@ruken.pw">email</a
    >.
  </div>

  <a
    href="/login"
    class="block max-w-lg mx-auto mt-4 p-4 bg-cyan-400/50 rounded text-white font-bold text-center"
  >
    Try Again
  </a>
{/if}
