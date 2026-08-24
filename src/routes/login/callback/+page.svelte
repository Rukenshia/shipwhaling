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
      return;
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
  <aside
    role="alert"
    aria-label="Wargaming login problem"
    class="header mx-auto flex max-w-lg items-start gap-3 border-2 border-amber-300/40 bg-amber-950/60 px-5 py-4 text-amber-50 shadow-lg backdrop-blur"
  >
    <svg
      class="mt-0.5 h-5 w-5 flex-none text-amber-300"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.166-.17 2.625-1.515 2.625H3.72c-1.347 0-2.19-1.459-1.516-2.625L8.485 2.495ZM10 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        clip-rule="evenodd"
      />
    </svg>
    <div>
      <p class="font-semibold">Wargaming login is currently unavailable</p>
      <p class="mt-1 text-sm leading-5 text-amber-100/90">
        There is currently a problem with the login. I have informed Wargaming.
      </p>
    </div>
  </aside>

  <a
    href="/login"
    class="block max-w-lg mx-auto mt-4 p-4 bg-cyan-400/50 rounded text-white font-bold text-center"
  >
    Try Again
  </a>
{/if}
