<script lang="ts">
  interface Props {
    title: string;
    value: number;
    icon?: any | undefined;
    children?: import('svelte').Snippet;
  }

  let { title, value, icon = undefined, children }: Props = $props();
</script>

<div
  class="bg-slate-950/50 backdrop-blur-sm rounded px-8 py-4 flex items-center text-center justify-around"
>
  <div class="flex flex-col space-between">
    <h1 class={`block text-6xl text-white font-bold drop-shadow-2xl uppercase`}>
      <div class="flex items-center gap-2 justify-center">
        {value}
        {#if icon}
          <img src={icon} class="h-14" alt="currency icon" />
        {/if}
      </div>
    </h1>

    <h2 class={`block flex-grow text-cyan-50/80 drop-shadow-2xl flex flex-col items-center`}>
      <div class="text-sm sm:text-base lg:text-lg leading-4">
        {title}
      </div>

      <!-- if slot used -->
      {#if children}
        <div class="text-xs leading-6 leading-1 h-6">
          {#if children}{@render children()}{:else}
            <!-- Default content when slot is not used -->
          {/if}
        </div>
      {/if}
    </h2>
  </div>
</div>
