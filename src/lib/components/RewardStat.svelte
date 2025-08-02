<script lang="ts">
  import { prettyAmount } from '$lib/util';
  import Box from './Box.svelte';

  interface Props {
    title: string;
    value: number;
    icon?: any | undefined;
    children?: import('svelte').Snippet;
  }

  let { title, value, icon = undefined, children }: Props = $props();
</script>

<Box variant="dark" class="backdrop-blur transition-all">
  <div class="flex flex-col items-center text-center">
    <div class="flex items-center gap-3 justify-center">
      <div class="text-4xl lg:text-5xl text-white font-bold font-sans">
        {prettyAmount(value)}
      </div>
      {#if icon}
        <img src={icon} class="h-8 lg:h-12" alt="currency icon" />
      {/if}
    </div>

    <div class="uppercase mt-2 text-base text-gray-300 font-medium tracking-wide">
      {title}
    </div>

    {#if children}
      <div class="text-xs text-gray-400">
        {@render children()}
      </div>
    {/if}
  </div>
</Box>
