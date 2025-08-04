<script lang="ts">
  import { prettyAmount } from '$lib/util';
  import Box from './Box.svelte';

  interface Props {
    title: string;
    value: number;
    icon?: any | undefined;
    children?: import('svelte').Snippet;
    variant?: 'default' | 'compact';
  }

  let { title, value, icon = undefined, children, variant = 'default' }: Props = $props();

  const isCompact = variant === 'compact';
</script>

<Box
  variant="dark"
  padding={isCompact ? 'p-2' : 'px-8 py-4'}
  class={isCompact ? 'backdrop-blur transition-all opacity-80' : 'backdrop-blur transition-all'}
>
  <div class="flex flex-col items-center text-center">
    <div class="flex items-center {isCompact ? 'gap-1' : 'gap-3'} justify-center">
      <div
        class={isCompact
          ? 'text-md lg:text-lg text-gray-200 font-semibold font-sans'
          : 'text-4xl lg:text-5xl text-white font-bold font-sans'}
      >
        {prettyAmount(value)}
      </div>
      {#if icon}
        <img src={icon} class={isCompact ? 'h-3 lg:h-5' : 'h-8 lg:h-12'} alt="currency icon" />
      {/if}
    </div>

    {#if !isCompact}
      <div
        class="uppercase mt-2 {isCompact
          ? 'text-xs text-gray-400'
          : 'text-base text-gray-300'} font-medium tracking-wide"
      >
        {title}
      </div>
    {/if}

    {#if children}
      <div class="text-xs text-gray-400">
        {@render children()}
      </div>
    {/if}
  </div>
</Box>
