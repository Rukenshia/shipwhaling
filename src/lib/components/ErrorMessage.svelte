<script lang="ts">
  import { base } from '$app/paths';
  import { WargamingApiError } from '$lib/wargamingApi';

  interface Props {
    children?: import('svelte').Snippet;
    error?: unknown;
  }

  let { children, error }: Props = $props();
</script>

<div role="alert" class="bg-rose-800/60 rounded p-8 shadow-inner inset-0">
  {@render children?.()}
  {#if error instanceof WargamingApiError}
    <div class="mt-4">
      {#if error.requiresLogin}
        <a href={`${base}/login`} class="font-semibold underline underline-offset-4"
          >Sign in again</a
        >
      {:else}
        <button
          onclick={() => window.location.reload()}
          class="font-semibold underline underline-offset-4">Try again</button
        >
      {/if}
    </div>
  {/if}
</div>
